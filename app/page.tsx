// app/page.tsx
import Gallery from './components/Gallery'
import UploadForm from './components/UploadForm'

export default function Home() {

  return (
    <section className="py-6 px-6 md:px-24 flex flex-col items-center gap-12 overflow-y-scroll scrollbar-hidden relative">
      <h1 className="text-5xl md:text-7xl">Image Gallery</h1>

      <Gallery />

      <UploadForm />
    </section>
  )
}
