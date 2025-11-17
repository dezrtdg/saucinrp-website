import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap-config'
import { Briefcase, DollarSign, Users, ArrowRight } from 'lucide-react'
import siteConfig from '../../config/site.config.json'
import { type Job } from '../../types/config'

export const Jobs = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredJobs = selectedCategory === 'all'
    ? siteConfig.jobs.list
    : siteConfig.jobs.list.filter(job => job.category === selectedCategory)

  const categoriesWithJobs = [
    { id: 'all', name: 'All Jobs', color: 'gold', jobCount: siteConfig.jobs.list.length },
    ...siteConfig.jobs.categories.map(category => ({
      ...category,
      jobCount: siteConfig.jobs.list.filter(job => job.category === category.id).length
    })).filter(cat => cat.jobCount > 0)
  ]

  const getSalaryDisplay = (salary: number) => {
    return `$${salary.toLocaleString()}/hour`
  }

  useGSAP(() => {
    // Header animation
    ScrollTrigger.create({
      trigger: titleRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.from('.jobs-header', {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out'
        })
      }
    })

    // Cards animation
    const cards = gridRef.current?.querySelectorAll('.job-card')
    if (cards && cards.length > 0) {
      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out'
          })
        },
        once: true,
        start: 'top 90%'
      })
    }
  }, [selectedCategory])

  return (
    <section ref={containerRef} id="jobs" className="section-padding bg-noir-soft relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-noir-pure via-noir-soft to-noir-pure" />

      <div className="container-cinema relative z-10">
        {/* Section header */}
        <div ref={titleRef} className="max-w-3xl mb-16">
          <p className="jobs-header font-mono text-accent-gold text-xs uppercase tracking-[0.3em] mb-6">
            {siteConfig.ui?.jobs?.sectionTag || 'Opportunities'}
          </p>

          <h2 className="jobs-header font-display text-5xl md:text-6xl lg:text-7xl text-blanc-pure uppercase leading-[0.9] mb-6">
            {siteConfig.ui?.jobs?.title || 'Make Your'}{' '}
            <span className="text-accent-gold">{siteConfig.ui?.jobs?.titleAccent || 'Living'}</span>
          </h2>

          <p className="jobs-header font-body text-blanc-pearl/70 text-lg max-w-2xl">
            {siteConfig.ui?.jobs?.subtitle || 'Choose your path in Los Santos. Legal or illegal, the choice is yours.'}
          </p>

          <div className="jobs-header w-20 h-[1px] bg-accent-gold/50 mt-6" />
        </div>

        {/* Category pills */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            {categoriesWithJobs.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-6 py-3 font-heading text-sm uppercase tracking-wider
                  border transition-all duration-300
                  ${
                    selectedCategory === category.id
                      ? 'bg-accent-gold text-noir-pure border-accent-gold'
                      : 'bg-transparent text-blanc-pearl/70 border-blanc-pure/20 hover:border-blanc-pure/40 hover:text-blanc-pure'
                  }
                `}
              >
                {category.name}
                <span className="ml-2 font-mono text-xs opacity-60">
                  ({category.jobCount})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid - Clean career cards */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job: Job) => {
            const category = siteConfig.jobs.categories.find(c => c.id === job.category)
            const isLegal = category?.legal !== false

            return (
              <article
                key={job.id}
                className="job-card group relative"
              >
                <div className="card-agency h-full flex flex-col overflow-hidden">
                  {/* Image section */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-noir-charcoal">
                    {job.image && (
                      <img
                        src={job.image}
                        alt={job.name}
                        className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-pure via-noir-pure/20 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`
                        px-3 py-1 font-mono text-xs uppercase tracking-wider
                        ${isLegal ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-danger/20 text-accent-danger'}
                        backdrop-blur-sm border ${isLegal ? 'border-accent-success/30' : 'border-accent-danger/30'}
                      `}>
                        {category?.name || 'Unknown'}
                      </span>
                    </div>

                    {/* Salary badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center gap-2 bg-noir-pure/80 backdrop-blur-sm px-3 py-2">
                        <DollarSign className="w-4 h-4 text-accent-gold" />
                        <span className="font-mono text-sm text-blanc-pure">
                          {getSalaryDisplay(job.salary || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Job title */}
                    <h3 className="font-display text-2xl text-blanc-pure uppercase mb-3">
                      {job.name}
                    </h3>

                    {/* Description */}
                    <p className="font-body text-blanc-pearl/60 text-sm leading-relaxed flex-1">
                      {job.description}
                    </p>

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-blanc-pure/10">
                        <p className="font-mono text-xs uppercase tracking-wider text-blanc-pearl/40 mb-2">
                          Requirements
                        </p>
                        <ul className="space-y-1">
                          {job.requirements.slice(0, 2).map((req: string, i: number) => (
                            <li key={i} className="font-body text-xs text-blanc-pearl/60">
                              • {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Apply button */}
                    <div className="mt-6">
                      <a
                        href={siteConfig.social?.discord || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex items-center gap-2
                          font-heading text-sm uppercase tracking-wider
                          text-accent-gold hover:text-accent-gold-light
                          transition-colors duration-300
                        "
                      >
                        {siteConfig.ui?.jobs?.applyButtonText || 'Apply Now'}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Stats bar */}
        <div className="mt-20 py-8 border-t border-blanc-pure/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Briefcase className="w-8 h-8 text-accent-gold mx-auto mb-3" />
              <p className="font-mono text-3xl text-blanc-pure mb-1">
                {siteConfig.jobs.list.length}
              </p>
              <p className="font-body text-xs uppercase tracking-wider text-blanc-pearl/60">
                {siteConfig.ui?.jobs?.totalJobsLabel || 'Total Jobs'}
              </p>
            </div>

            <div className="text-center">
              <Users className="w-8 h-8 text-accent-gold mx-auto mb-3" />
              <p className="font-mono text-3xl text-blanc-pure mb-1">
                {siteConfig.jobs.categories.length}
              </p>
              <p className="font-body text-xs uppercase tracking-wider text-blanc-pearl/60">
                Categories
              </p>
            </div>

            <div className="text-center">
              <DollarSign className="w-8 h-8 text-accent-gold mx-auto mb-3" />
              <p className="font-mono text-3xl text-blanc-pure mb-1">
                ${Math.min(...siteConfig.jobs.list.map((j: Job) => j.salary || 0))}-${Math.max(...siteConfig.jobs.list.map((j: Job) => j.salary || 0))}
              </p>
              <p className="font-body text-xs uppercase tracking-wider text-blanc-pearl/60">
                {siteConfig.ui?.jobs?.salaryRangeLabel || 'Salary Range'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}