import { useEffect, useState } from 'react'
import { GlassButton } from './GlassButton'
import { ThemeToggle } from './ThemeToggle'
import { navLinks, profile } from '../../data/site'

export function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="glass glass--strong nav-bar" aria-label="Primary">
        <a className="nav-logo" href="#top">
          <span className="nav-mark" aria-hidden="true">
            H
          </span>
          <span className="nav-name">{profile.name.split(' ')[0]}</span>
        </a>

        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-end">
          <ThemeToggle />
          <GlassButton href="#contact" size="md" tone="accent">
            Let’s talk
          </GlassButton>
          <button
            className="glass-btn glass-btn--light nav-menu"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-menu" className="glass glass--strong nav-sheet">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="nav-sheet-actions">
            <ThemeToggle showLabel />
            <a className="glass-btn glass-btn--accent glass-btn--md" href="#contact" onClick={() => setOpen(false)}>
              <span>Let’s talk</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}
