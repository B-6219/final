import { useRef, useState } from 'react'
import { FiUpload, FiX, FiLoader, FiImage } from 'react-icons/fi'
import { uploadImages, isCloudinaryConfigured } from '@/lib/cloudinary'
import { useToast } from '@/context/ToastContext'

/**
 * Drag/click multi-image uploader. `images` is an array of URLs (already
 * uploaded); `onChange(nextUrls)` fires whenever the set changes. Shows a
 * clear "not configured" state instead of a broken upload button when
 * Cloudinary keys are still blank in .env.local.
 */
export default function ImageUploader({ images = [], onChange, max = 8 }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const { showToast } = useToast()

  if (!isCloudinaryConfigured) {
    return (
      <div className="border border-dashed border-graphite-light p-6 text-center">
        <FiImage className="mx-auto text-silver-dim mb-2" size={24} />
        <p className="text-silver text-sm">
          Add <code className="text-amber">VITE_CLOUDINARY_CLOUD_NAME</code> and{' '}
          <code className="text-amber">VITE_CLOUDINARY_UPLOAD_PRESET</code> to <code className="text-amber">.env.local</code>{' '}
          to enable image uploads.
        </p>
      </div>
    )
  }

  const handleFiles = async (fileList) => {
    if (!fileList?.length) return
    if (images.length + fileList.length > max) {
      showToast(`You can upload up to ${max} images per vehicle`, 'error')
      return
    }
    setUploading(true)
    try {
      const urls = await uploadImages(fileList)
      onChange([...images, ...urls])
      showToast(`${urls.length} image${urls.length !== 1 ? 's' : ''} uploaded`, 'success')
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeAt = (i) => onChange(images.filter((_, idx) => idx !== i))

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {images.map((url, i) => (
          <div key={url} className="relative aspect-square group">
            <img src={url} alt="" className="w-full h-full object-cover border border-graphite-light" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remove image"
              className="absolute top-1 right-1 p-1 bg-obsidian/80 text-bone opacity-0 group-hover:opacity-100 transition-opacity hover:bg-racing-red"
            >
              <FiX size={12} />
            </button>
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border border-dashed border-graphite-light flex flex-col items-center justify-center gap-1 text-silver hover:border-amber hover:text-amber transition-colors disabled:opacity-50"
          >
            {uploading ? <FiLoader className="animate-spin" size={18} /> : <FiUpload size={18} />}
            <span className="text-[10px] uppercase tracking-wide">{uploading ? 'Uploading' : 'Add'}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
