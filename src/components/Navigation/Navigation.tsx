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
    () =>
      siteConfig.ui?.navigation?.menuItems || ['Features', 'Jobs', 'Rules', 'Team', 'Gallery', 'Store'],
    []
  )

  // 👉 NEW: Tebex store URL (from config, with fallback)
  const storeUrl = siteConfig.social?.store || 'https://YOURSTORE.tebex.io'

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

  // ... (rest of your hooks & functions stay the same)

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
              {siteConfig.server?.logo?.type === 'image' ? (
                <img
                  src={siteConfig.server.logo.content}
                  alt={siteConfig.server?.name || 'Server Logo'}
                  className="h-10 w-auto"
                />
              ) : (
                <span className="font-display text-3xl text-blanc-pure uppercase tracking-wider transition-colors group-hover:text-accent-gold">
                  {siteConfig.server.logo.content}
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
                  const isStore = sectionId === 'store'

                  // 👉 DESKTOP: Store = external link, others = scroll buttons
                  if (isStore) {
                    return (
                      <a
                        key={item}
                        href={storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          font-heading text-sm uppercase tracking-wider
                          transition-all duration-300 relative
                          text-blanc-pearl/60 hover:text-blanc-pure
                        `}
                      >
                        {item}
                      </a>
                    )
                  }

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
                const isStore = sectionId === 'store'

                // 👉 MOBILE: Store = external link, others = scroll buttons
                if (isStore) {
                  return (
                    <a
                      key={item}
                      href={storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        menu-item block w-full
                        font-display text-2xl uppercase tracking-wider
                        transition-colors duration-300
                        text-blanc-pure hover:text-accent-gold
                      `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="inline-block mr-4 font-mono text-xs opacity-40">
                        0{index + 1}
                      </span>
                      {item}
                    </a>
                  )
                }

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

            {/* Server Info + buttons stay the same... */}
            {/* ... */}
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
