import { listFilesInFolder } from '@/lib/storage-utils'
import Image from 'next/image'

export default async function Gallery() {
  const imageUrls = await listFilesInFolder()

  return (
    <div className="w-full p-6 bg-gray-100/60 shadow-xl rounded-md flex items-center justify-evenly gap-6">
      {imageUrls.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt=""
          width={500}
          height={500}
          className="w-64 aspect-square rounded"
        />
      ))}
    </div>
  )
}
