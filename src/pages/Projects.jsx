import { useState } from 'react'
import { experiences, projects } from '../data/portfolio'
import { ExperienceCard, ExternalLink, Icon, ProjectCard, Reveal, SectionHeading, Tags } from '../components/UI'
import { ContactStrip } from '../components/Layout'

const filters = ['Todos', 'Desarrollo web', 'Investigación', 'Open source', 'Universidad']

export function Projects() {
  const [filter, setFilter] = useState('Todos')
  const shown = projects.filter(project => filter === 'Todos' || project.category === filter)
  return <><section className="page-intro container"><Reveal><p className="eyebrow">PROYECTOS / UNA SELECCIÓN DE MI TRABAJO</p><h1>Ideas que toman<br /><span className="serif gold">forma.</span></h1><p className="page-description">Desde sistemas inteligentes hasta experiencias web.<br />Cada proyecto, una forma distinta de resolver.</p></Reveal></section>
    <section className="container projects-list"><div className="filter-bar" role="group" aria-label="Filtrar proyectos por categoría">{filters.map(item => <button key={item} className={filter === item ? 'filter active' : 'filter'} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}<span>{item === 'Todos' ? projects.length : projects.filter(p => p.category === item).length}</span></button>)}</div><p className="results-count" role="status">{shown.length} proyectos {filter === 'Todos' ? 'para explorar' : `· ${filter}`}</p><div className="project-grid" key={filter}>{shown.map((project, i) => <ProjectCard key={project.slug} project={project} index={i} />)}</div></section><ContactStrip /></>
}

export function ProjectDetail({ project }) {
  const related = experiences.filter(experience => project.related?.includes(experience.slug))
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  return <><article className="container detail-page"><a href="#/proyectos" className="back-link"><Icon name="back" size={16} />Todos los proyectos</a><Reveal className="detail-header"><p className="eyebrow">{project.eyebrow}</p><h1>{project.name}<span className="gold">.</span></h1><p className="detail-intro">{project.intro}</p><div className="detail-actions">{project.url && <ExternalLink href={project.url} className="button button-primary">{project.urlLabel || 'Visitar landing'}</ExternalLink>}<Tags items={project.tags} /></div></Reveal>
      <Reveal className={`detail-cover project-${project.slug}`}><img src={project.image} alt={project.imageAlt} width="1600" height="900" fetchPriority="high" /></Reveal>
      <div className="article-layout"><aside className="article-sidebar"><div><span className="eyebrow">MI PARTICIPACIÓN</span><p>{project.role}</p></div><div><span className="eyebrow">CONTEXTO</span><p>{project.category}</p></div>{project.year && <div><span className="eyebrow">PERIODO</span><p>{project.year}</p></div>}{project.outcome && <div className="sidebar-award"><Icon name="trophy" /><p>{project.outcome}</p></div>}</aside><div className="article-body">{project.sections.map(([title, text], i) => <Reveal key={title}><span className="article-number">0{i + 1}</span><h2>{title}</h2><p>{text}</p></Reveal>)}</div></div>
      {related.length > 0 && <section className="related-section"><SectionHeading label="DEL PROYECTO A LA EXPERIENCIA" title="Una idea, distintos escenarios." /><div className="experience-grid">{related.map(experience => <ExperienceCard key={experience.slug} experience={experience} />)}</div></section>}
      <a href={`#/proyectos/${next.slug}`} className="next-story"><div><p className="eyebrow">SIGUIENTE PROYECTO</p><h2>{next.name}</h2></div><Icon name="upRight" size={42} /></a>
    </article><ContactStrip /></>
}
