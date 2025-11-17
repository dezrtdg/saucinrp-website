import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap-config'
import siteConfig from '../../config/site.config.json'
import { ChevronDown, Circle } from 'lucide-react'

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [playerCount, setPlayerCount] = useState(0)
  const [isServerOnline, setIsServerOnline] = useState(true)
  const [currentTip, setCurrentTip] = useState(0)

  // Rotate through loading tips
  useEffect(() => {
    if (!isLoading) return
    const tips = siteConfig.server.loadingTips || []
    if (tips.length === 0) return

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoading])

  // Loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          setTimeout(() => setIsLoading(false), 500)
          clearInterval(timer)
          return 100
        }
        // Cinematic loading speed - slower for effect
        const increment = Math.random() * 3 + 1
        return Math.min(prev + increment, 100)
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  // Fetch player data
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!siteConfig.api.serverCode || siteConfig.api.serverCode === 'replaceme') {
        console.warn('No server code configured')
        setPlayerCount(Math.floor(Math.random() * 50) + 10)
        setIsServerOnline(false)
        return
      }

      try {
        const response = await fetch(
          `${siteConfig.api.cfxApiUrl}${siteConfig.api.serverCode}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            }
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.Data && Array.isArray(data.Data.players)) {
            setPlayerCount(data.Data.players.length)
            setIsServerOnline(true)
          }
        }
      } catch (error) {
        console.warn('Failed to fetch player data:', error)
        setPlayerCount(Math.floor(Math.random() * 50) + 10)
        setIsServerOnline(false)
      }
    }

    fetchPlayerData()
    const interval = setInterval(fetchPlayerData, siteConfig.api.refreshInterval)
    return () => clearInterval(interval)
  }, [])

  // Cinematic animations
  useGSAP(() => {
    if (!isLoading && heroRef.current) {
      const tl = gsap.timeline()

      // Cinematic fade in
      tl.from(imageRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out'
      })
      .from(contentRef.current?.querySelectorAll('.hero-content') || [], {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      }, '-=0.8')
      .from(statsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (imageRef.current) {
            gsap.set(imageRef.current, {
              y: self.progress * 100,
            })
          }
          if (contentRef.current) {
            gsap.set(contentRef.current, {
              y: self.progress * 50,
              opacity: 1 - self.progress * 0.5
            })
          }
        }
      })
    }
  }, [isLoading])

  // GTA-style loading screen
  if (isLoading) {
    const tips = siteConfig.server.loadingTips || []

    return (
      <div className="loading-screen-cinema">
        <div className="absolute inset-0 bg-noir-pure">
          {/* Background image with Ken Burns effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 animate-ken-burns"
              style={{
                backgroundImage: `url('${siteConfig.images?.hero?.loadingBackground || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop'}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-pure via-noir-pure/50 to-transparent" />
          </div>

          {/* Loading content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-12 lg:p-16">
            {/* Top section */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-display text-5xl lg:text-7xl text-blanc-pure uppercase tracking-wider">
                  {siteConfig.server?.name || 'NightCity RP'}
                </h1>
                <p className="font-heading text-blanc-pearl/80 text-lg mt-2">
                  {siteConfig.server?.tagline || 'Where Stories Come Alive'}
                </p>
              </div>
              {siteConfig.server?.logo?.type === 'text' && (
                <div className="font-display text-6xl lg:text-8xl text-accent-gold opacity-20">
                  {siteConfig.server.logo.content}
                </div>
              )}
            </div>

            {/* Bottom section */}
            <div className="space-y-8">
              {/* Loading tip */}
              {tips.length > 0 && (
                <div className="max-w-2xl">
                  <p className="font-body text-blanc-pearl/60 text-sm uppercase tracking-wider mb-2">
                    Tip
                  </p>
                  <p className="font-heading text-blanc-pure text-xl animate-fade-in">
                    {tips[currentTip]}
                  </p>
                </div>
              )}

              {/* Loading bar */}
              <div className="max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-blanc-pearl/60 text-xs uppercase tracking-wider">
                    Loading
                  </span>
                  <span className="font-mono text-blanc-pearl/60 text-xs">
                    {Math.floor(loadingProgress)}%
                  </span>
                </div>
                <div className="h-1 bg-noir-charcoal/50 overflow-hidden">
                  <div
                    className="h-full bg-accent-gold transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-noir-pure">
      <div ref={heroRef} className="relative min-h-screen flex items-center">
        {/* Cinematic background */}
        <div ref={imageRef} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${siteConfig.images?.hero?.mainBackground || 'https://images.unsplash.com/photo-1486428128344-5413e434ad35?w=1920&h=1080&fit=crop'}')`,
            }}
          />
          {/* Cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-noir-pure via-noir-pure/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-pure via-transparent to-noir-pure/30" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-vignette" />
        </div>

        {/* Content */}
        <div className="container-cinema relative z-10">
          <div ref={contentRef} className="max-w-3xl">
            {/* Small tagline */}
            <div className="hero-content mb-6">
              <p className="font-mono text-accent-gold text-sm uppercase tracking-[0.3em]">
                {siteConfig.server?.tagline || 'Where Stories Come Alive'}
              </p>
            </div>

            {/* Main title */}
            <h1 className="hero-content font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-blanc-pure uppercase leading-[0.9] mb-6">
              {siteConfig.server?.name?.split(' ').map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              )) || <><span className="block">NightCity</span><span className="block">Roleplay</span></>}
            </h1>

            {/* Description */}
            <p className="hero-content font-body text-blanc-pearl/80 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              {siteConfig.server?.description || 'Experience the most immersive GTA V roleplay server'}
            </p>

            {/* CTA Buttons */}
            <div className="hero-content flex flex-col sm:flex-row gap-4">
              <a
                href={`fivem://connect/${siteConfig.api.serverCode}`}
                className="btn-cinema-gold uppercase"
              >
                {siteConfig.ui?.common?.playNow || 'PLAY NOW'}
              </a>

              <a
                href={siteConfig.social?.discord || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cinema uppercase"
              >
                {siteConfig.ui?.common?.discord || 'DISCORD'}
              </a>
            </div>
          </div>
        </div>

        {/* Minimal stats bar */}
        <div ref={statsRef} className="absolute bottom-0 left-0 right-0 bg-noir-pure/80 backdrop-blur-md border-t border-blanc-pure/10">
          <div className="container-cinema py-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              {/* Server status */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Circle
                    className={`w-2 h-2 ${isServerOnline ? 'text-accent-success' : 'text-accent-danger'} fill-current`}
                  />
                  <span className="font-mono text-xs uppercase tracking-wider text-blanc-pearl/60">
                    {isServerOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                {/* Players */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-blanc-pearl/60">
                    Players:
                  </span>
                  <span className="font-mono text-sm text-blanc-pure">
                    {playerCount}/{siteConfig.server.maxPlayers}
                  </span>
                </div>

                {/* Server IP */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-blanc-pearl/60">
                    Server:
                  </span>
                  <span className="font-mono text-sm text-blanc-pure">
                    {siteConfig.server?.ip || 'play.server.com'}
                  </span>
                </div>
              </div>

              {/* Established date */}
              <div className="hidden lg:block">
                <span className="font-mono text-xs uppercase tracking-wider text-blanc-pearl/60">
                  EST. {siteConfig.server?.stats?.established || '2024'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-subtle-float">
          <ChevronDown className="w-6 h-6 text-blanc-pure/40" />
        </div>
      </div>
    </div>
  )
}