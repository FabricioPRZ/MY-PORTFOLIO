import { useEffect, useRef, useState } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { usePortfolio } from '../hooks/usePortfolio.js'

export function Icon({ name = 'arrow', size = 20, ...props }) {
  const paths = {
    arrow: <><path d="M5 12h14M12 5l7 7-7 7" /></>,
    upRight: <><path d="M6 18 18 6M6 6h12v12" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4" /></>,
    back: <><path d="M19 12H5m7-7-7 7 7 7" /></>,
    close: <><path d="m6 6 12 12M6 18 18 6" /></>,
    menu: <><path d="M4 8h16M4 16h16" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    code: <><path d="m7 6-6 6 6 6m10-12 6 6-6 6m-3-16-4 20" /></>,
    layers: <><path d="m12 3 10 6-10 6L2 9l10-6Zm-10 12 10 6 10-6M2 12l10 6 10-6" /></>,
    phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 18h4" /></>,
    spark: <><path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" /></>,
    trophy: <><path d="M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v7m-4 0h8" /></>,
    github: <><path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.7-1.6 6.7-7.3a5.7 5.7 0 0 0-1.5-4 5.3 5.3 0 0 0-.1-4S17.7-.4 15 1.5a14 14 0 0 0-6 0C6.3-.4 4.9 0 4.9 0a5.3 5.3 0 0 0-.1 4 5.7 5.7 0 0 0-1.5 4c0 5.7 3.4 6.9 6.7 7.3A3.5 3.5 0 0 0 9 18v4" transform="translate(1 2) scale(.9)" /></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 10v7m0-10v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.arrow}</svg>
}

export function Reveal({ children, className = '', delay = 0, ...props }) {
  const reduced = useReducedMotion()
  return <Motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={reduced ? { duration: 0.12 } : { type: 'spring', bounce: 0, duration: 0.65, delay }} {...props}>{children}</Motion.div>
}

export function Button({ children, href, secondary = false, icon = 'arrow', className = '', ...props }) {
  return <a className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`} href={href} {...props}>{children}{icon && <Icon name={icon} size={18} />}</a>
}

export function ExternalLink({ href, children, className = 'text-link', ...props }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>{children}<Icon name="upRight" size={17} /><span className="sr-only"> (abre en otra pestaña)</span></a>
}

export function CVButton({ secondary = true, className = '' }) {
  const profile = usePortfolio().getProfile()
  return <Button href={profile.cv} download="CV_Victor_Fabricio_Perez.pdf" secondary={secondary} icon="download" className={className}>Descargar CV <span className="file-type">PDF</span></Button>
}

export function SectionHeading({ label, title, text, href, linkText = 'Ver todos' }) {
  return <Reveal className="section-heading"><div><p className="eyebrow">{label}</p><h2>{title}</h2>{text && <p className="section-description">{text}</p>}</div>{href && <a className="text-link" href={href}>{linkText}<Icon /></a>}</Reveal>
}

export function Tags({ items }) {
  return <ul className="tags" aria-label="Tecnologías y áreas">{items.map(item => <li key={item}>{item}</li>)}</ul>
}

export function ProjectCard({ project, index = 0 }) {
  return <Reveal className={`project-card project-${project.slug}`} delay={(index % 2) * 0.06}>
    <a className="project-image-link" href={`#/proyectos/${project.slug}`} aria-label={`Conocer el proyecto ${project.name}`}>
      <div className="project-image"><img src={project.image} alt={project.imageAlt} loading="lazy" width="1600" height="900" /></div>
      <span className="image-arrow"><Icon name="upRight" /></span>
      {project.slug === 'nich-ka' && <span className="image-award"><Icon name="trophy" size={14} /> ExpoCiencias · 1.er lugar</span>}
    </a>
    <div className="project-copy"><div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
      <h3><a href={`#/proyectos/${project.slug}`}>{project.name}</a></h3><p>{project.description}</p>
      <div className="project-actions"><a className="text-link" href={`#/proyectos/${project.slug}`}>Explorar proyecto<Icon size={16} /></a>{project.url && <ExternalLink href={project.url}>{project.urlLabel || 'Ver landing'}</ExternalLink>}</div>
    </div>
  </Reveal>
}

export function ExperienceCard({ experience, index = 0 }) {
  return <Reveal delay={(index % 3) * 0.06} className="experience-card">
    <a href={`#/experiencias/${experience.slug}`} className="experience-photo"><img src={experience.image} alt={experience.name} loading="lazy" width="800" height="600" /><span className="image-arrow"><Icon name="upRight" /></span></a>
    <div className="project-meta"><span>{experience.category}</span><span>{experience.year}</span></div>
    <h3><a href={`#/experiencias/${experience.slug}`}>{experience.title}</a></h3><p>{experience.name}</p>
  </Reveal>
}

export function Gallery({ images, title = 'El proyecto, en imágenes.' }) {
  const [selected, setSelected] = useState(null)
  const dialog = useRef(null)
  const selectedImage = selected === null ? null : images[selected]
  const isOpen = selected !== null
  useEffect(() => {
    if (!isOpen) return
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
    // Keep the native dialog open while navigating between photos.
  }, [isOpen])

  function navigate(direction) {
    setSelected(current => (current + direction + images.length) % images.length)
  }

  return <section className="gallery-section" aria-label="Galería de fotografías">
    <SectionHeading label="MEMORIA VISUAL" title={title} text="Cada imagen, una parte del camino. Selecciona una para verla completa." />
    <div className="gallery-grid">{images.map((image, i) => <Reveal key={image.src}><button className="gallery-item" onClick={() => setSelected(i)} aria-label={`Ampliar: ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" width="800" height="600" /><span className="image-arrow"><Icon name="upRight" /></span></button></Reveal>)}</div>
    <dialog ref={dialog} className="lightbox" aria-label="Visor de fotografías" onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null) }} onKeyDown={event => { if (event.key === 'ArrowRight') navigate(1); if (event.key === 'ArrowLeft') navigate(-1) }}>
      {selectedImage && <div className="lightbox-content"><button className="icon-button lightbox-close" aria-label="Cerrar fotografía" autoFocus onClick={() => setSelected(null)}><Icon name="close" /></button>
        <img src={selectedImage.src} alt={selectedImage.alt} />
        <div className="lightbox-bar"><button className="icon-button" aria-label="Fotografía anterior" onClick={() => navigate(-1)}><Icon name="back" /></button><div aria-live="polite"><p>{selectedImage.alt}</p><span>{selected + 1} / {images.length}</span></div><button className="icon-button" aria-label="Fotografía siguiente" onClick={() => navigate(1)}><Icon /></button></div>
      </div>}
    </dialog>
  </section>
}
