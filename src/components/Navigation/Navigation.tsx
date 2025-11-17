import { useState, useEffect, useRef, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X, Copy, Check, Circle } from 'lucide-react'
import { gsap } from '../../lib/gsap-config'
import siteConfig from '../../config/site.config.json'

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const menuItems = useMemo(
    () => siteConfig.ui?.navigation?.menuItems || ['Features', 'Jobs', 'Rules', 'Team', 'Gallery'],
    []
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section
      const sections = ['home', ...menuItems.map(item => item.toLowerCase())]
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [menuItems])

  // Animate menu open/close
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      gsap.fromTo(menuRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power3.out' }
      )
      gsap.from('.menu-item', {
        x: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.2,
        ease: 'power3.out'
      })
    }
  }, [isMenuOpen])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsMenuOpen(false)
  }

  const copyServerIP = async () => {
    const serverAddress = `${siteConfig.server.ip}:${siteConfig.server.port}`
    try {
      await navigator.clipboard.writeText(serverAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Don't show navigation on legal pages
  if (location.pathname === '/terms' || location.pathname === '/privacy') {
    return null
  }

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav
        ref={navRef}
        className={`
          fixed top-0 left-0 right-0 z-[100]
          transition-all duration-500
          ${isScrolled
            ? 'bg-noir-pure/80 backdrop-blur-xl border-b border-blanc-pure/10'
            : 'bg-transparent'
          }
        `}
      >
        <div className="container-cinema">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-3 group"
            >
              {siteConfig.server?.logo?.type === 'text' ? (
                <span className="font-display text-3xl text-blanc-pure uppercase tracking-wider transition-colors group-hover:text-accent-gold">
                  {siteConfig.server.logo.content}
                </span>
              ) : (
                <span className="font-display text-2xl text-blanc-pure uppercase tracking-wider transition-colors group-hover:text-accent-gold">
                  {siteConfig.server?.shortName || 'NCRP'}
                </span>
              )}
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Menu Items */}
              <nav className="flex items-center gap-8">
                {menuItems.map((item) => {
                  const sectionId = item.toLowerCase()
                  const isActive = activeSection === sectionId

                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection(sectionId)}
                      className={`
                        font-heading text-sm uppercase tracking-wider
                        transition-all duration-300 relative
                        ${isActive
                          ? 'text-blanc-pure'
                          : 'text-blanc-pearl/60 hover:text-blanc-pure'
                        }
                      `}
                    >
                      {item}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-accent-gold" />
                      )}
                    </button>
                  )
                })}
              </nav>

              {/* Server Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-noir-charcoal/30 backdrop-blur-sm border border-blanc-pure/10">
                <Circle className="w-2 h-2 text-accent-success fill-current animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-blanc-pearl/60">
                  {siteConfig.ui?.navigation?.onlineText || 'Online'}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4">
                <a
                  href={`fivem://connect/${siteConfig.api.serverCode}`}
                  className="btn-cinema uppercase text-sm"
                >
                  {siteConfig.ui?.navigation?.connectButton || 'Connect'}
                </a>

                <a
                  href={siteConfig.social?.discord || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-sm uppercase tracking-wider text-accent-gold hover:text-accent-gold-light transition-colors"
                >
                  {siteConfig.ui?.navigation?.discordButton || 'Discord'}
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-blanc-pure"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-noir-pure/95 backdrop-blur-xl z-[99] lg:hidden"
        >
          <div className="flex flex-col h-full pt-24 pb-8 px-8">
            {/* Menu Items */}
            <nav className="flex-1 space-y-6">
              {menuItems.map((item, index) => {
                const sectionId = item.toLowerCase()
                const isActive = activeSection === sectionId

                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(sectionId)}
                    className={`
                      menu-item block w-full text-left
                      font-display text-2xl uppercase tracking-wider
                      transition-colors duration-300
                      ${isActive
                        ? 'text-accent-gold'
                        : 'text-blanc-pure hover:text-accent-gold'
                      }
                    `}
                  >
                    <span className="inline-block mr-4 font-mono text-xs opacity-40">
                      0{index + 1}
                    </span>
                    {item}
                  </button>
                )
              })}
            </nav>

            {/* Server Info */}
            <div className="border-t border-blanc-pure/10 pt-8 space-y-6">
              <button
                onClick={copyServerIP}
                className="w-full p-4 bg-noir-charcoal/50 border border-blanc-pure/10 flex items-center justify-between group hover:bg-noir-charcoal/70 transition-colors"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-blanc-pearl/60 mb-1">
                    Server IP
                  </p>
                  <p className="font-mono text-sm text-blanc-pure">
                    {siteConfig.server.ip}:{siteConfig.server.port}
                  </p>
                </div>
                {copied ? (
                  <Check className="w-5 h-5 text-accent-success" />
                ) : (
                  <Copy className="w-5 h-5 text-blanc-pearl/60 group-hover:text-blanc-pure transition-colors" />
                )}
              </button>

              {/* CTA Buttons */}
              <a
                href={`fivem://connect/${siteConfig.api.serverCode}`}
                className="btn-cinema-gold uppercase w-full text-center"
              >
                {siteConfig.ui?.navigation?.connectButton || 'Connect'}
              </a>

              <a
                href={siteConfig.social?.discord || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cinema uppercase w-full text-center"
              >
                {siteConfig.ui?.navigation?.discordButton || 'Discord'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-noir-pure/60 backdrop-blur-sm z-[98] lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}