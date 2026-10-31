import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { usePortfolio } from '../hooks/usePortfolio.js'
import { Button, ExternalLink, Icon, Reveal } from './UI'

const navigation = [['Inicio', '/'], ['Proyectos', '/proyectos'], ['Experiencias', '/experiencias'], ['Sobre mí', '/sobre-mi']]

export function Header({ path }) {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const menuButton = useRef(null)
  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])
  const active = href => href === '/' ? path === '/' : path.startsWith(href)
  return <header className="site-header">
    <div className="nav-wrap"><a href="#/" className="brand" aria-label="Fabricio Pérez, inicio" onClick={() => setOpen(false)}><img src="/Logo/logo.svg" width="42" height="42" alt="" /><span>Fabricio<span className="brand-dot">.</span></span></a>
      <nav className="desktop-nav" aria-label="Navegación principal">{navigation.map(([label, href]) => <a key={href} href={`#${href}`} aria-current={active(href) ? 'page' : undefined}>{label}</a>)}</nav>
      <a className="nav-contact" href="#/contacto">Hablemos<Icon name="upRight" size={16} /></a>
      <button ref={menuButton} className="icon-button menu-toggle" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button>
    </div>
    <AnimatePresence initial={false}>{open && <Motion.nav id="mobile-menu" className="mobile-nav" aria-label="Navegación móvil" initial={{ opacity: 0, y: reduced ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ type: 'spring', bounce: 0, duration: 0.3 }}>{[...navigation, ['Contacto', '/contacto']].map(([label, href]) => <a key={href} href={`#${href}`} aria-current={active(href) ? 'page' : undefined} onClick={() => setOpen(false)}>{label}<Icon name="upRight" size={18} /></a>)}</Motion.nav>}</AnimatePresence>
  </header>
}

export function ContactStrip() {
  const profile = usePortfolio().getProfile()
  return <section className="contact-strip container"><Reveal><p className="eyebrow">EL SIGUIENTE PROYECTO</p><h2>Las buenas ideas<br />empiezan conversando<span className="gold">.</span></h2><div className="contact-strip-bottom"><p>¿Tienes un proyecto, una oportunidad<br className="desktop-break" /> o una idea que quieras compartir?</p><Button href={`mailto:${profile.email}`} icon="upRight">Hablemos de tu idea</Button></div></Reveal></section>
}

export function Footer() {
  const profile = usePortfolio().getProfile()
  return <footer className="site-footer container"><div className="footer-top"><a href="#/" className="brand"><img src="/Logo/logo.svg" width="34" height="34" alt="" /><span>Fabricio<span className="brand-dot">.</span></span></a><p>Desde Chiapas, México.</p><div className="footer-social"><ExternalLink href={profile.github}>GitHub</ExternalLink><ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Fabricio Pérez</span><a href={profile.cv} download>Currículum en PDF<Icon name="download" size={14} /></a><a href="#/contacto">Contacto<Icon name="upRight" size={14} /></a></div></footer>
}
