import { profile } from '../data/portfolio'
import { Button, CVButton, ExternalLink, Icon, Reveal } from '../components/UI'

export function Contact() {
  return <section className="container contact-page"><Reveal><p className="eyebrow">CONTACTO / EL INICIO DE ALGO</p><h1>Una buena conversación.<br /><span className="serif gold">Un nuevo comienzo.</span></h1><p className="page-description">Proyectos, oportunidades o ideas por explorar.<br />Me dará gusto saber de ti.</p></Reveal><div className="contact-grid"><Reveal className="contact-main"><Icon name="mail" size={30} /><p className="eyebrow">ESCRÍBEME</p><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a><p>Cuéntame qué tienes en mente y cómo puedo aportar.</p><Button href={`mailto:${profile.email}`} icon="upRight">Enviar un correo</Button></Reveal><Reveal className="contact-options"><ExternalLink href={profile.linkedin} className="contact-option"><span><Icon name="linkedin" /><span><strong>Conectemos en LinkedIn</strong><small>Trayectoria y conversación profesional</small></span></span></ExternalLink><ExternalLink href={profile.github} className="contact-option"><span><Icon name="github" /><span><strong>Mi trabajo en GitHub</strong><small>Código, herramientas y proyectos</small></span></span></ExternalLink><a href="tel:+529619009651" className="contact-option"><span><Icon name="phone" /><span><strong>{profile.phone}</strong><small>También podemos conversar por teléfono</small></span></span><Icon name="upRight" size={17} /></a></Reveal></div><Reveal className="contact-bottom"><div><Icon name="pin" /><p>{profile.location}</p></div><CVButton /></Reveal></section>
}

export function NotFound() {
  return <section className="container not-found"><p className="eyebrow">404 / UN PEQUEÑO DESVÍO</p><h1>Por aquí no era<span className="gold">.</span></h1><p>Esta página no existe, pero hay buenas ideas por descubrir.</p><Button href="#/" icon="back">Volver al inicio</Button></section>
}
