import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap-config'
import { AlertCircle, Info, AlertTriangle } from 'lucide-react'
import siteConfig from '../../config/site.config.json'
import { type Rule } from '../../types/config'

export const Rules = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const rulesRef = useRef<HTMLDivElement>(null)

  // Cast rules to proper type
  const rules = siteConfig.rules as Rule[]

  // Get unique categories from rules
  const categories = ['all', ...Array.from(new Set(rules.map((r) => r.category)))]

  const filteredRules = selectedCategory === 'all'
    ? rules
    : rules.filter((rule) => rule.category === selectedCategory)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-accent-danger border-accent-danger/20 bg-accent-danger/5'
      case 'medium':
        return 'text-accent-gold border-accent-gold/20 bg-accent-gold/5'
      default:
        return 'text-accent-info border-accent-info/20 bg-accent-info/5'
    }
  }

  useGSAP(() => {
    // Header animation
    ScrollTrigger.create({
      trigger: titleRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.from('.rules-header', {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out'
        })
      }
    })

    // Rules animation
    const ruleElements = rulesRef.current?.querySelectorAll('.rule-item')
    if (ruleElements && ruleElements.length > 0) {
      ScrollTrigger.batch(ruleElements, {
        onEnter: (elements) => {
          gsap.from(elements, {
            x: -30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out'
          })
        },
        once: true,
        start: 'top 90%'
      })
    }
  }, [selectedCategory])

  // Group rules by severity
  const highPriorityRules = filteredRules.filter((r) => r.severity === 'high')
  const mediumPriorityRules = filteredRules.filter((r) => r.severity === 'medium')
  const lowPriorityRules = filteredRules.filter((r) => r.severity === 'low')

  return (
    <section ref={containerRef} id="rules" className="section-padding bg-noir-pure relative overflow-hidden">
      {/* Subtle pattern background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-noir-pure via-noir-soft to-noir-pure" />
        <div className="absolute inset-0 bg-subtle-grain opacity-20" />
      </div>

      <div className="container-cinema relative z-10">
        {/* Section header */}
        <div ref={titleRef} className="max-w-3xl mb-16">
          <p className="rules-header font-mono text-accent-gold text-xs uppercase tracking-[0.3em] mb-6">
            {siteConfig.ui?.rules?.sectionTag || 'Guidelines'}
          </p>

          <h2 className="rules-header font-display text-5xl md:text-6xl lg:text-7xl text-blanc-pure uppercase leading-[0.9] mb-6">
            {siteConfig.ui?.rules?.title || 'Know The'}{' '}
            <span className="text-accent-gold">{siteConfig.ui?.rules?.titleAccent || 'Rules'}</span>
          </h2>

          <p className="rules-header font-body text-blanc-pearl/70 text-lg max-w-2xl">
            {siteConfig.ui?.rules?.subtitle || 'Break these and face the consequences. We run a tight ship here.'}
          </p>

          <div className="rules-header w-20 h-[1px] bg-accent-gold/50 mt-6" />
        </div>

        {/* Category filters */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-5 py-2 font-mono text-xs uppercase tracking-wider
                  border transition-all duration-300
                  ${
                    selectedCategory === category
                      ? 'bg-blanc-pure text-noir-pure border-blanc-pure'
                      : 'bg-transparent text-blanc-pearl/60 border-blanc-pure/20 hover:border-blanc-pure/40 hover:text-blanc-pure'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Rules list - Clean documentation style */}
        <div ref={rulesRef} className="space-y-16">
          {/* High Priority */}
          {highPriorityRules.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <AlertCircle className="w-5 h-5 text-accent-danger" />
                <h3 className="font-heading text-sm uppercase tracking-wider text-accent-danger">
                  {siteConfig.ui?.rules?.severityLabels?.high || 'High Priority'}
                </h3>
                <div className="flex-1 h-[1px] bg-accent-danger/20" />
              </div>

              <div className="grid gap-4">
                {highPriorityRules.map((rule) => (
                  <article
                    key={rule.id}
                    className="rule-item group"
                  >
                    <div className={`
                      relative p-6
                      border-l-2 ${getSeverityColor(rule.severity)}
                      bg-noir-soft/30 backdrop-blur-sm
                      transition-all duration-300
                      hover:bg-noir-soft/50
                    `}>
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="pt-1">
                          {getSeverityIcon(rule.severity)}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="font-display text-xl text-blanc-pure uppercase mb-2">
                            {rule.title}
                          </h4>
                          <p className="font-body text-blanc-pearl/60 text-sm leading-relaxed">
                            {rule.description}
                          </p>
                        </div>

                        {/* Rule ID */}
                        <div className="hidden lg:block">
                          <span className="font-mono text-xs text-blanc-pearl/30">
                            #{rule.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority */}
          {mediumPriorityRules.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <AlertTriangle className="w-5 h-5 text-accent-gold" />
                <h3 className="font-heading text-sm uppercase tracking-wider text-accent-gold">
                  {siteConfig.ui?.rules?.severityLabels?.medium || 'Medium Priority'}
                </h3>
                <div className="flex-1 h-[1px] bg-accent-gold/20" />
              </div>

              <div className="grid gap-4">
                {mediumPriorityRules.map((rule) => (
                  <article
                    key={rule.id}
                    className="rule-item group"
                  >
                    <div className={`
                      relative p-6
                      border-l-2 ${getSeverityColor(rule.severity)}
                      bg-noir-soft/30 backdrop-blur-sm
                      transition-all duration-300
                      hover:bg-noir-soft/50
                    `}>
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="pt-1">
                          {getSeverityIcon(rule.severity)}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="font-display text-xl text-blanc-pure uppercase mb-2">
                            {rule.title}
                          </h4>
                          <p className="font-body text-blanc-pearl/60 text-sm leading-relaxed">
                            {rule.description}
                          </p>
                        </div>

                        {/* Rule ID */}
                        <div className="hidden lg:block">
                          <span className="font-mono text-xs text-blanc-pearl/30">
                            #{rule.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Low Priority */}
          {lowPriorityRules.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Info className="w-5 h-5 text-accent-info" />
                <h3 className="font-heading text-sm uppercase tracking-wider text-accent-info">
                  {siteConfig.ui?.rules?.severityLabels?.low || 'Low Priority'}
                </h3>
                <div className="flex-1 h-[1px] bg-accent-info/20" />
              </div>

              <div className="grid gap-4">
                {lowPriorityRules.map((rule) => (
                  <article
                    key={rule.id}
                    className="rule-item group"
                  >
                    <div className={`
                      relative p-6
                      border-l-2 ${getSeverityColor(rule.severity)}
                      bg-noir-soft/30 backdrop-blur-sm
                      transition-all duration-300
                      hover:bg-noir-soft/50
                    `}>
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="pt-1">
                          {getSeverityIcon(rule.severity)}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="font-display text-xl text-blanc-pure uppercase mb-2">
                            {rule.title}
                          </h4>
                          <p className="font-body text-blanc-pearl/60 text-sm leading-relaxed">
                            {rule.description}
                          </p>
                        </div>

                        {/* Rule ID */}
                        <div className="hidden lg:block">
                          <span className="font-mono text-xs text-blanc-pearl/30">
                            #{rule.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer text */}
        <div className="mt-20 text-center">
          <div className="inline-block">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold/60">
              {siteConfig.ui?.rules?.footer || 'Play Fair or Get Banned'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}