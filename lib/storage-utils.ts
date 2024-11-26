// lib/storage-utils.ts

import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID!
const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY!.replace(/\\n/g, '\n')
const clientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL!
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME!

// Configure Google Cloud Storage client
const storage = new Storage({
  projectId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
})

const bucket = storage.bucket(bucketName)

/**
 * Upload a file to Google Cloud Storage
 * @param file - The file to upload (typically from a form)
 * @param folder - Optional folder path in the bucket
 * @returns Promise with public URL of the uploaded file
 */
export async function uploadFileToStorage(
  file: File,
  folder: string = 'rooms'
): Promise<string> {
  // Generate a unique filename
  const fileName = `${folder}/${uuidv4()}-${file.name}`

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Create a file in the bucket
  const blob = bucket.file(fileName)
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.type,
    },
  })

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => reject(err))

    blobStream.on('finish', async () => {
      // Construct and return the public URL
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`
      resolve(publicUrl)
    })

    blobStream.end(buffer)
  })
}

/**
 * Delete a file from Google Cloud Storage
 * @param fileUrl - The full URL of the file to delete
 */
export async function deleteFileFromStorage(fileUrl: string): Promise<void> {
  // Extract filename from the full URL
  const filename = fileUrl.split(
    `https://storage.googleapis.com/${bucketName}/`
  )[1]

  try {
    await bucket.file(filename).delete()
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

/**
 * List files in a specific folder of the bucket
 * @param folder - The folder to list files from
 * @returns Array of file URLs
 */
export async function listFilesInFolder(
  folder: string = 'rooms'
): Promise<string[]> {
  const [files] = await bucket.getFiles({ prefix: `${folder}/` })

  return files.map(
    (file) => `https://storage.googleapis.com/${bucketName}/${file.name}`
  )
}
