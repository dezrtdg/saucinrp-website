/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cinematic Agency Design System
        'noir': {
          'pure': '#000000',          // Pure black
          'soft': '#0A0A0A',          // Soft black
          'charcoal': '#1A1A1A',      // Charcoal
          'graphite': '#2A2A2A',      // Graphite
          'steel': '#3A3A3A',         // Steel gray
        },
        'blanc': {
          'pure': '#FFFFFF',          // Pure white
          'cream': '#FAFAFA',         // Soft cream
          'pearl': '#F5F5F5',         // Pearl white
          'smoke': '#E8E8E8',         // Light smoke
          'ash': '#D0D0D0',           // Ash gray
        },
        'accent': {
          'gold': '#C9B037',          // Premium gold
          'gold-light': '#D4AF37',    // Light gold
          'gold-dark': '#B8A026',     // Dark gold
          'danger': '#DC143C',        // Crimson red
          'success': '#2ECC40',       // Success green
          'info': '#0074D9',          // Info blue
        },
        // Legacy support (for gradual migration)
        'status': {
          'online': '#2ECC40',        // Success green
          'offline': '#DC143C',       // Danger red
          'warning': '#FFD700',       // Warning gold
        },
        // Overlay colors for cinematic effects
        'overlay': {
          'dark': 'rgba(0, 0, 0, 0.9)',
          'medium': 'rgba(0, 0, 0, 0.6)',
          'light': 'rgba(0, 0, 0, 0.3)',
          'white': 'rgba(255, 255, 255, 0.1)',
          'blur': 'rgba(0, 0, 0, 0.4)',
        }
      },
      fontFamily: {
        'display': ['Bebas Neue', 'Anton', 'sans-serif'],     // GTA-style headlines
        'heading': ['Montserrat', 'sans-serif'],              // Clean subheadings
        'body': ['Inter', 'system-ui', 'sans-serif'],         // Ultra-clean body
        'mono': ['JetBrains Mono', 'Roboto Mono', 'monospace'], // Stats & numbers
        // Legacy support
        'stencil': ['Bebas Neue', 'sans-serif'],              // Keep for compatibility
      },
      animation: {
        'fade-in': 'fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'ken-burns': 'kenBurns 20s ease-out infinite',
        'loading-bar': 'loadingBar 2s cubic-bezier(0.4, 0, 0.2, 1)',
        'parallax': 'parallax 10s linear infinite',
        'film-grain': 'filmGrain 8s steps(10) infinite',
        'subtle-float': 'subtleFloat 6s ease-in-out infinite',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slideRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'reveal': 'reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.1) translate(-2%, -2%)' },
        },
        loadingBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        parallax: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-20px)' },
        },
        filmGrain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-1%, -1%)' },
          '20%': { transform: 'translate(1%, 1%)' },
          '30%': { transform: 'translate(-1%, 1%)' },
          '40%': { transform: 'translate(1%, -1%)' },
          '50%': { transform: 'translate(-1%, 0)' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        reveal: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
      },
      backgroundImage: {
        'noir-gradient': 'linear-gradient(180deg, #000000 0%, #0A0A0A 50%, #000000 100%)',
        'cinematic-overlay': 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%)',
        'subtle-grain': 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.02"/%3E%3C/svg%3E")',
        'vignette': 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
        'gold-shimmer': 'linear-gradient(105deg, transparent 40%, rgba(201, 176, 55, 0.1) 50%, transparent 60%)',
      },
      boxShadow: {
        'cinema': '0 20px 40px -20px rgba(0, 0, 0, 0.8)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'gold-glow': '0 0 30px rgba(201, 176, 55, 0.3)',
        'inner-cinema': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}