import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap-config'
import siteConfig from '../../config/site.config.json'
import { type Feature } from '../../types/config'
import * as LucideIcons from 'lucide-react'

export const Features = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Title animation
    ScrollTrigger.create({
      trigger: titleRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.from('.features-header', {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out'
        })
      }
    })

    // Cards animation with stagger
    const cards = gridRef.current?.querySelectorAll('.feature-card')
    if (cards && cards.length > 0) {
      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            overwrite: 'auto'
          })
        },
        once: true,
        start: 'top 85%'
      })
    }
  })

  const getIcon = (iconName: string) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<{ size?: number; className?: string }>
    return Icon || LucideIcons.Box
  }

  // Split features into highlighted and regular
  const highlightedFeatures = siteConfig.features.filter((f: Feature) => f.highlight)
  const regularFeatures = siteConfig.features.filter((f: Feature) => !f.highlight)

  return (
    <section ref={sectionRef} id="features" className="section-padding bg-noir-pure relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-subtle-grain opacity-30" />

      <div className="container-cinema relative z-10">
        {/* Section header */}
        <div ref={titleRef} className="max-w-3xl mb-20">
          <p className="features-header font-mono text-accent-gold text-xs uppercase tracking-[0.3em] mb-6">
            {siteConfig.ui?.features?.sectionTag || 'Why Choose Us'}
          </p>

          <h2 className="features-header font-display text-5xl md:text-6xl lg:text-7xl text-blanc-pure uppercase leading-[0.9] mb-6">
            {siteConfig.ui?.features?.title || 'Server'}{' '}
            <span className="text-accent-gold">{siteConfig.ui?.features?.titleAccent || 'Features'}</span>
          </h2>

          <div className="features-header w-20 h-[1px] bg-accent-gold/50" />
        </div>

        {/* Editorial Grid Layout */}
        <div ref={gridRef} className="space-y-32">
          {/* Highlighted features - Large editorial cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {highlightedFeatures.map((feature: Feature, index: number) => {
              const IconComponent = getIcon(feature.icon)
              const isEven = index % 2 === 0

              return (
                <div
                  key={feature.id}
                  className={`feature-card group ${isEven ? 'lg:col-span-1' : 'lg:col-span-1'}`}
                >
                  <article className="relative">
                    {/* Large image area with icon */}
                    <div className="relative aspect-[16/10] bg-noir-charcoal/30 overflow-hidden mb-8">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/10 to-transparent" />

                      {/* Large icon in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="w-32 h-32 text-accent-gold/20 transition-all duration-500 group-hover:scale-110 group-hover:text-accent-gold/30" />
                      </div>

                      {/* Number badge */}
                      <div className="absolute top-8 left-8">
                        <span className="font-mono text-accent-gold text-sm">
                          0{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="font-display text-3xl md:text-4xl text-blanc-pure uppercase tracking-wide">
                        {feature.title}
                      </h3>

                      <p className="font-body text-blanc-pearl/70 text-lg leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Subtle divider */}
                      <div className="pt-4">
                        <div className="w-12 h-[1px] bg-accent-gold/30 transition-all duration-300 group-hover:w-24 group-hover:bg-accent-gold/50" />
                      </div>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>

          {/* Regular features - Smaller grid */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularFeatures.map((feature: Feature) => {
                const IconComponent = getIcon(feature.icon)

                return (
                  <div
                    key={feature.id}
                    className="feature-card group"
                  >
                    <article className="card-agency p-8 h-full">
                      {/* Icon */}
                      <div className="mb-6">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-accent-gold" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-xl text-blanc-pure mb-3">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="font-body text-blanc-pearl/60 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </article>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom highlight text */}
          <div className="text-center pt-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold/60">
              {siteConfig.ui?.features?.highlight || `${siteConfig.server.maxPlayers}+ SLOT SERVER • CUSTOM SCRIPTS • 24/7 UPTIME`}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}