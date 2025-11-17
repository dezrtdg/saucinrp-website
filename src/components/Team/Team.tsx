import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap-config'
import siteConfig from '../../config/site.config.json'
import { type TeamMember } from '../../types/config'
import { Shield, Crown, Wrench, Users, AtSign } from 'lucide-react'

export const Team = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Header animation
    ScrollTrigger.create({
      trigger: titleRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.from('.team-header', {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out'
        })
      }
    })

    // Team cards animation
    const cards = gridRef.current?.querySelectorAll('.team-card')
    if (cards && cards.length > 0) {
      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out'
          })
        },
        once: true,
        start: 'top 85%'
      })
    }
  })

  const getRoleIcon = (role: string) => {
    const roleLower = role.toLowerCase()
    if (roleLower.includes('owner')) return Crown
    if (roleLower.includes('admin')) return Shield
    if (roleLower.includes('dev')) return Wrench
    return Users
  }

  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase()
    if (roleLower.includes('owner')) return 'text-accent-gold border-accent-gold/20'
    if (roleLower.includes('admin')) return 'text-accent-danger border-accent-danger/20'
    if (roleLower.includes('dev')) return 'text-accent-info border-accent-info/20'
    return 'text-accent-success border-accent-success/20'
  }

  // Cast team to proper type and sort by role importance
  const team = siteConfig.team as TeamMember[]
  const sortedTeam = [...team].sort((a, b) => {
    const roleOrder = ['owner', 'admin', 'dev', 'mod']
    const aIndex = roleOrder.findIndex(r => a.role.toLowerCase().includes(r))
    const bIndex = roleOrder.findIndex(r => b.role.toLowerCase().includes(r))
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  })

  return (
    <section ref={sectionRef} id="team" className="section-padding bg-noir-soft relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-noir-pure via-noir-soft to-noir-pure" />
      </div>

      <div className="container-cinema relative z-10">
        {/* Section header */}
        <div ref={titleRef} className="max-w-3xl mb-20">
          <p className="team-header font-mono text-accent-gold text-xs uppercase tracking-[0.3em] mb-6">
            {siteConfig.ui?.team?.sectionTag || 'The Crew'}
          </p>

          <h2 className="team-header font-display text-5xl md:text-6xl lg:text-7xl text-blanc-pure uppercase leading-[0.9] mb-6">
            {siteConfig.ui?.team?.title || 'The'}{' '}
            <span className="text-accent-gold">{siteConfig.ui?.team?.titleAccent || 'Team'}</span>
          </h2>

          <p className="team-header font-body text-blanc-pearl/70 text-lg max-w-2xl">
            {siteConfig.ui?.team?.subtitle || 'The ones who keep the server running smoothly.'}
          </p>

          <div className="team-header w-20 h-[1px] bg-accent-gold/50 mt-6" />
        </div>

        {/* Team Grid - Professional Agency Style */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedTeam.map((member) => {
            const RoleIcon = getRoleIcon(member.role)
            const isActive = member.status === 'active'

            return (
              <article key={member.id} className="team-card group">
                <div className="relative h-full">
                  {/* Card container */}
                  <div className="bg-noir-charcoal/30 backdrop-blur-sm border border-blanc-pure/5 overflow-hidden h-full flex flex-col transition-all duration-500 hover:bg-noir-charcoal/50 hover:border-blanc-pure/10">
                    {/* Avatar section */}
                    <div className="relative aspect-square bg-gradient-to-br from-noir-pure to-noir-charcoal overflow-hidden">
                      {member.avatar && (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105"
                        />
                      )}

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-noir-pure via-transparent to-transparent opacity-60" />

                      {/* Status indicator */}
                      <div className="absolute top-4 right-4">
                        <div className={`
                          flex items-center gap-2 px-3 py-1
                          backdrop-blur-sm border
                          ${isActive
                            ? 'bg-accent-success/10 border-accent-success/30 text-accent-success'
                            : 'bg-noir-pure/50 border-blanc-pure/20 text-blanc-pearl/60'
                          }
                        `}>
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-success' : 'bg-blanc-pearl/40'}`} />
                          <span className="font-mono text-xs uppercase">
                            {isActive ? 'Active' : 'Offline'}
                          </span>
                        </div>
                      </div>

                      {/* Role badge */}
                      {member.badge && (
                        <div className="absolute bottom-4 left-4">
                          <span className={`
                            px-3 py-1 font-mono text-xs uppercase tracking-wider
                            backdrop-blur-sm border ${getRoleColor(member.role)}
                            bg-noir-pure/50
                          `}>
                            {member.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content section */}
                    <div className="flex-1 p-6 flex flex-col">
                      {/* Name */}
                      <h3 className="font-display text-2xl text-blanc-pure uppercase mb-1">
                        {member.name.split(' ')[0]}
                      </h3>

                      {/* Nickname if exists */}
                      {member.name.includes("'") && (
                        <p className="font-heading text-sm text-accent-gold mb-2">
                          "{member.name.match(/'([^']+)'/)?.[1]}"
                        </p>
                      )}

                      {/* Role */}
                      <div className="flex items-center gap-2 mb-4">
                        <RoleIcon className="w-4 h-4 text-blanc-pearl/40" />
                        <span className="font-body text-sm text-blanc-pearl/60">
                          {member.role}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="font-body text-xs text-blanc-pearl/50 leading-relaxed flex-1">
                        {member.description}
                      </p>

                      {/* Discord handle */}
                      {member.discord && (
                        <div className="mt-4 pt-4 border-t border-blanc-pure/10">
                          <div className="flex items-center gap-2">
                            <AtSign className="w-3 h-3 text-blanc-pearl/30" />
                            <span className="font-mono text-xs text-blanc-pearl/40">
                              {member.discord}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Join CTA */}
        <div className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display text-3xl md:text-4xl text-blanc-pure uppercase mb-4">
              {siteConfig.ui?.team?.joinTitle || 'Join The Team'}
            </h3>
            <p className="font-body text-blanc-pearl/60 mb-8">
              {siteConfig.ui?.team?.joinSubtitle || 'Think you got what it takes?'}
            </p>
            <a
              href={siteConfig.social?.discord || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cinema-gold uppercase"
            >
              {siteConfig.ui?.team?.joinButton || 'Apply on Discord'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}