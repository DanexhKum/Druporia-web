// ============================================================
// lib/storage.ts
// Unified storage service — supports Supabase Storage or AWS S3.
// Configure via STORAGE_PROVIDER env variable.
// 
// SECURITY MODEL:
//   - Uploaded .zip files land in a PRIVATE bucket/folder.
//   - Files are NEVER publicly accessible by URL.
//   - Signed URLs (15-minute TTL) are generated server-side
//     only after purchase verification.
// ============================================================

import { createClient } from '@supabase/supabase-js'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// ── Supabase admin client (service-role key, server-side only) ──
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// ── AWS S3 client ─────────────────────────────────────────────
function getS3Client() {
  return new S3Client({
    region: process.env.AWS_REGION ?? 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
}

const SUPABASE_BUCKET = 'product-downloads' // Private Supabase bucket name
const SUPABASE_THUMBNAIL_BUCKET = 'product-thumbnails' // Public Supabase bucket name
const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME ?? 'private-product-downloads'
const SIGNED_URL_TTL_SECONDS = 60 * 15 // 15 minutes

export type UploadResult = {
  storagePath: string // The private path stored in DB
  fileSize: string    // Human-readable file size
}

export type PublicUploadResult = {
  publicUrl: string
  storagePath: string
}

// ── Upload a product .zip file ────────────────────────────────
export async function uploadProductFile(
  file: File,
  slug: string
): Promise<UploadResult> {
  const timestamp = Date.now()
  const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
  const extension = file.name.split('.').pop() ?? 'zip'
  const storagePath = `products/${sanitizedSlug}/${timestamp}.${extension}`
  const fileSizeLabel = formatFileSize(file.size)

  const provider = process.env.STORAGE_PROVIDER ?? 'supabase'

  if (provider === 's3') {
    const s3 = getS3Client()
    const buffer = Buffer.from(await file.arrayBuffer())

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: storagePath,
        Body: buffer,
        ContentType: 'application/zip',
        ContentDisposition: `attachment; filename="${file.name}"`,
        // Enforce server-side encryption
        ServerSideEncryption: 'AES256',
        // Mark object as private (no public-read ACL)
        // ACL: 'private', // uncomment if your bucket allows ACL
        Metadata: {
          originalName: file.name,
          slug: sanitizedSlug,
          uploadedAt: new Date().toISOString(),
        },
      })
    )
  } else {
    // Supabase Storage — private bucket
    const supabase = getSupabaseAdmin()
    const buffer = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: 'application/zip',
        upsert: false,
        metadata: {
          originalName: file.name,
          slug: sanitizedSlug,
        },
      })

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`)
    }
  }

  return { storagePath, fileSize: fileSizeLabel }
}

// ── Upload a public product thumbnail image ─────────────────────
export async function uploadProductThumbnail(
  file: File,
  slug: string,
  folder = 'products'
): Promise<PublicUploadResult> {
  const supabase = getSupabaseAdmin()
  const timestamp = Date.now()
  const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const sanitizedFolder = folder.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
  const storagePath = `${sanitizedFolder}/${sanitizedSlug}/${timestamp}.${extension}`
  const buffer = await file.arrayBuffer()

  await ensurePublicThumbnailBucket(supabase)

  const { error } = await supabase.storage
    .from(SUPABASE_THUMBNAIL_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
      metadata: {
        originalName: file.name,
        slug: sanitizedSlug,
      },
    })

  if (error) {
    throw new Error(`Supabase thumbnail upload failed: ${error.message}`)
  }

  const { data } = supabase.storage
    .from(SUPABASE_THUMBNAIL_BUCKET)
    .getPublicUrl(storagePath)

  return { publicUrl: data.publicUrl, storagePath }
}

async function ensurePublicThumbnailBucket(
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  const { data } = await supabase.storage.getBucket(SUPABASE_THUMBNAIL_BUCKET)

  if (data) return

  const { error } = await supabase.storage.createBucket(
    SUPABASE_THUMBNAIL_BUCKET,
    {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    }
  )

  if (error && !error.message.toLowerCase().includes('already exists')) {
    throw new Error(`Failed to create thumbnail bucket: ${error.message}`)
  }
}

// ── Generate a short-lived signed download URL ─────────────────
export async function generateSignedDownloadUrl(
  storagePath: string
): Promise<string> {
  const provider = process.env.STORAGE_PROVIDER ?? 'supabase'

  if (provider === 's3') {
    const s3 = getS3Client()
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: storagePath,
    })
    return getSignedUrl(s3, command, { expiresIn: SIGNED_URL_TTL_SECONDS })
  } else {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS)

    if (error || !data?.signedUrl) {
      throw new Error(`Failed to generate signed URL: ${error?.message}`)
    }

    return data.signedUrl
  }
}

// ── Delete a product file from storage ────────────────────────
export async function deleteProductFile(storagePath: string): Promise<void> {
  const provider = process.env.STORAGE_PROVIDER ?? 'supabase'

  if (provider === 's3') {
    const s3 = getS3Client()
    await s3.send(
      new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: storagePath })
    )
  } else {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .remove([storagePath])

    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`)
    }
  }
}

// ── Recover a storage path from a public thumbnail URL ────────
// The DB stores the public URL, not the path, so cleaning up a
// replaced image means reversing getPublicUrl(). Returns null for
// anything that is not a URL in our own thumbnail bucket — an
// externally-hosted thumbnailUrl must never be treated as ours.
export function thumbnailStoragePathFromUrl(
  url: string | null | undefined
): string | null {
  if (!url) return null

  const marker = `/storage/v1/object/public/${SUPABASE_THUMBNAIL_BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null

  const path = url.slice(index + marker.length).split('?')[0]
  return path ? decodeURIComponent(path) : null
}

// ── Delete several thumbnails, never throwing ─────────────────
// Cleanup is best-effort: a storage failure must not fail the
// user's edit, which has already been persisted.
export async function deleteThumbnailsByUrl(
  urls: (string | null | undefined)[]
): Promise<void> {
  const paths = urls
    .map(thumbnailStoragePathFromUrl)
    .filter((path): path is string => Boolean(path))

  if (paths.length === 0) return

  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.storage
      .from(SUPABASE_THUMBNAIL_BUCKET)
      .remove(paths)

    if (error) {
      console.error('[storage] Thumbnail cleanup failed:', error.message)
    }
  } catch (err) {
    console.error('[storage] Thumbnail cleanup failed:', err)
  }
}

export async function deleteProductThumbnail(storagePath: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.storage
    .from(SUPABASE_THUMBNAIL_BUCKET)
    .remove([storagePath])

  if (error) {
    throw new Error(`Supabase thumbnail delete failed: ${error.message}`)
  }
}

// ── Utility: human-readable file size ─────────────────────────
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
