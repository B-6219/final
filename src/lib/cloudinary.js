const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

/**
 * Uploads a single File to Cloudinary using an unsigned upload preset.
 * Unsigned uploads only need the cloud name + preset (both public-safe) —
 * never the API secret, which stays server-side only. Create the preset
 * at https://cloudinary.com/console/settings/upload as "Unsigned".
 *
 * Returns the secure_url on success, or throws with a readable message.
 */
export async function uploadImage(file, { folder = 'alhusnain-motors/vehicles' } = {}) {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured — add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.local'
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message || `Cloudinary upload failed (${res.status})`)
  }

  const data = await res.json()
  return data.secure_url
}

/** Uploads multiple files in parallel, returning URLs in the same order. */
export async function uploadImages(files, options) {
  return Promise.all(Array.from(files).map((file) => uploadImage(file, options)))
}
