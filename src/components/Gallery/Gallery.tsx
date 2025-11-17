import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap-config'
import siteConfig from '../../config/site.config.json'
import { type GalleryImage, type GalleryCategory } from '../../types/config'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

export const Gallery = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const filteredImages = selectedCategory === 'all'
    ? siteConfig.gallery.images
    : siteConfig.gallery.images.filter((img: GalleryImage) => img.category === selectedCategory)

  // Group images by featured status
  const featuredImages = filteredImages.filter((img: GalleryImage) => img.featured)
  const regularImages = filteredImages.filter((img: GalleryImage) => !img.featured)

  useGSAP(() => {
    // Header animation
    ScrollTrigger.create({
      trigger: titleRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.from('.gallery-header', {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out'
        })
      }
    })

    // Gallery items animation
    const items = galleryRef.current?.querySelectorAll('.gallery-item')
    if (items && items.length > 0) {
      ScrollTrigger.batch(items, {
        onEnter: (elements) => {
          gsap.from(elements, {
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
          })
        },
        once: true,
        start: 'top 90%'
      })
    }
  }, [selectedCategory])

  const handleImageClick = (index: number) => {
    setSelectedImage(index)
    setIsLightboxOpen(true)
  }

  const handlePrevious = () => {
    if (selectedImage === null) return
    const newIndex = selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1
    setSelectedImage(newIndex)
  }

  const handleNext = () => {
    if (selectedImage === null) return
    const newIndex = selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1
    setSelectedImage(newIndex)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setTimeout(() => setSelectedImage(null), 300)
  }

  return (
    <>
      <section ref={sectionRef} id="gallery" className="section-padding bg-noir-pure relative overflow-hidden">
        <div className="container-cinema relative z-10">
          {/* Section header */}
          <div ref={titleRef} className="max-w-3xl mb-16">
            <p className="gallery-header font-mono text-accent-gold text-xs uppercase tracking-[0.3em] mb-6">
              {siteConfig.ui?.gallery?.sectionTag || 'Showcase'}
            </p>

            <h2 className="gallery-header font-display text-5xl md:text-6xl lg:text-7xl text-blanc-pure uppercase leading-[0.9] mb-6">
              {siteConfig.ui?.gallery?.title || 'Media'}{' '}
              <span className="text-accent-gold">{siteConfig.ui?.gallery?.titleAccent || 'Gallery'}</span>
            </h2>

            <p className="gallery-header font-body text-blanc-pearl/70 text-lg max-w-2xl">
              {siteConfig.ui?.gallery?.subtitle || 'Captured moments from our server.'}
            </p>

            <div className="gallery-header w-20 h-[1px] bg-accent-gold/50 mt-6" />
          </div>

          {/* Category tabs - Netflix style */}
          <div className="mb-12">
            <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2">
              {siteConfig.gallery.categories.map((category: GalleryCategory) => {
                const imageCount = category.id === 'all'
                  ? siteConfig.gallery.images.length
                  : siteConfig.gallery.images.filter((img: GalleryImage) => img.category === category.id).length

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      font-heading text-sm uppercase tracking-wider whitespace-nowrap
                      transition-all duration-300 pb-2 border-b-2
                      ${
                        selectedCategory === category.id
                          ? 'text-blanc-pure border-accent-gold'
                          : 'text-blanc-pearl/50 border-transparent hover:text-blanc-pearl/80'
                      }
                    `}
                  >
                    {category.name}
                    <span className="ml-2 font-mono text-xs opacity-60">
                      ({imageCount})
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Gallery Grid - Netflix/Editorial hybrid */}
          <div ref={galleryRef}>
            {/* Featured images - Large showcase */}
            {featuredImages.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold/60">
                    Featured
                  </h3>
                  <div className="flex-1 h-[1px] bg-blanc-pure/10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredImages.slice(0, 2).map((image: GalleryImage) => {
                    const imageIndex = filteredImages.findIndex((img: GalleryImage) => img.id === image.id)

                    return (
                      <article
                        key={image.id}
                        className="gallery-item group cursor-pointer"
                        onClick={() => handleImageClick(imageIndex)}
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-noir-charcoal">
                          <img
                            src={image.src}
                            alt={image.alt || image.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-noir-pure via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

                          {/* Content on hover */}
                          <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h4 className="font-display text-2xl text-blanc-pure uppercase mb-2">
                              {image.title}
                            </h4>
                            <p className="font-mono text-xs text-accent-gold uppercase tracking-wider">
                              {siteConfig.ui?.gallery?.evidencePrefix || 'File #'}{image.id.toString().padStart(3, '0')}
                            </p>
                          </div>

                          {/* Featured badge */}
                          {image.featured && (
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1 bg-accent-gold text-noir-pure font-mono text-xs uppercase tracking-wider">
                                {siteConfig.ui?.gallery?.featuredBadge || 'Featured'}
                              </span>
                            </div>
                          )}

                          {/* Expand icon */}
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Maximize2 className="w-6 h-6 text-blanc-pure" />
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Regular images - Grid layout */}
            {regularImages.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-blanc-pearl/40">
                    All Media
                  </h3>
                  <div className="flex-1 h-[1px] bg-blanc-pure/10" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {regularImages.map((image: GalleryImage) => {
                    const imageIndex = filteredImages.findIndex((img: GalleryImage) => img.id === image.id)

                    return (
                      <article
                        key={image.id}
                        className="gallery-item group cursor-pointer"
                        onClick={() => handleImageClick(imageIndex)}
                      >
                        <div className="relative aspect-square overflow-hidden bg-noir-charcoal">
                          <img
                            src={image.src}
                            alt={image.alt || image.title}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-90"
                          />

                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-noir-pure/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Maximize2 className="w-8 h-8 text-blanc-pure" />
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox - Cinematic fullscreen viewer */}
      {isLightboxOpen && selectedImage !== null && (
        <div className="fixed inset-0 z-[200] bg-noir-pure/95 backdrop-blur-xl flex items-center justify-center animate-fade-in">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 p-3 text-blanc-pure/60 hover:text-blanc-pure transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-8 top-1/2 -translate-y-1/2 p-3 text-blanc-pure/60 hover:text-blanc-pure transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 p-3 text-blanc-pure/60 hover:text-blanc-pure transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image container */}
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt || filteredImages[selectedImage].title}
              className="w-full h-full object-contain"
            />

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-noir-pure to-transparent">
              <h3 className="font-display text-2xl text-blanc-pure uppercase mb-2">
                {filteredImages[selectedImage].title}
              </h3>
              <p className="font-mono text-xs text-accent-gold uppercase tracking-wider">
                {siteConfig.ui?.gallery?.evidencePrefix || 'File #'}
                {filteredImages[selectedImage].id.toString().padStart(3, '0')} •
                {filteredImages[selectedImage].category}
              </p>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {filteredImages.slice(0, 10).map((img: GalleryImage, index: number) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(index)}
                className={`
                  w-12 h-12 overflow-hidden border-2 transition-all duration-300
                  ${selectedImage === index
                    ? 'border-accent-gold scale-110'
                    : 'border-blanc-pure/20 opacity-60 hover:opacity-100'
                  }
                `}
              >
                <img
                  src={img.src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}