'use client'

import Image from 'next/image'
import { useState } from 'react'
import Loader from '../components/Loader'
import Toast from '../components/Toast'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean | null>(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile))
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!file) return

    const formData = new FormData()
    formData.append('roomImage', file)

    try {
      const response = await fetch('/api/rooms/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      console.log(result)
      if (response.ok) {
        setSuccess('Image Uploaded Successfully!')
      } else {
        setError('An error occurred.')
      }
    } catch (error) {
      console.error('An error occurred: ', error)
      setError('An error occurred.')
    } finally {
      setLoading(false)
      setTimeout(() => {
        setSuccess(null)
        setError(null)
        setFile(null)
        setPreview(null)
      }, 3000)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full aspect-[3/1] p-6 bg-gray-100/60 shadow-xl rounded-md flex flex-col items-center justify-center gap-6"
      >
        <div className="w-64 aspect-square bg-gray-300 rounded flex flex-col items-center justify-center relative overflow-hidden">
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Selected preview"
                width={500}
                height={500}
                className="w-full h-full"
              />

              <label
                htmlFor="image-upload"
                className="absolute top-0 left-0 w-full h-full z-[2] bg-slate-300/80 flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300"
              >
                <p className="capitalize font-medium px-6 py-2 rounded border border-foreground bg-gray-200">
                  select different image
                </p>
              </label>
            </>
          ) : (
            <>
              <label
                htmlFor="image-upload"
                className="transition-all duration-300 px-6 py-2 rounded border border-foreground cursor-pointer bg-gray-200 hover:shadow-lg"
              >
                Choose Image
              </label>
            </>
          )}
        </div>

        <input
          id="image-upload"
          type="file"
          accept=".jpg,.jpeg,.png,.jfif,.webp"
          onChange={handleChange}
          className="hidden"
        />

        <button
          type="submit"
          className="text-background bg-accent hover:bg-foreground transition-all duration-300 px-6 py-2 rounded disabled:opacity-50 disabled:hover:bg-accent flex gap-2 items-center"
          disabled={!file}
        >
          {loading ? (
            <>
              <Loader />
              <p>Uploading ...</p>
            </>
          ) : (
            'Upload Image'
          )}
        </button>
      </form>

      {error && <Toast message={error} type="error" />}
      {success && <Toast message={success} type="success" />}
    </>
  )
}
