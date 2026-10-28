import { experiences } from '../data/portfolio'
import { Button, ExperienceCard, ExternalLink, Gallery, Icon, Reveal } from '../components/UI'
import { ContactStrip } from '../components/Layout'

export function Experiences() {
  return <><section className="page-intro container"><Reveal><p className="eyebrow">EXPERIENCIAS / APRENDER EN EL CAMINO</p><h1>Fuera del editor.<br /><span className="serif gold">Dentro del mundo.</span></h1><p className="page-description">Investigación, comunidad y conversaciones que impulsan ideas.<br />Estas son algunas de las historias detrás de mi trabajo.</p></Reveal></section><section className="container experiences-list"><div className="experience-grid experience-grid-large">{experiences.map((experience, i) => <ExperienceCard key={experience.slug} experience={experience} index={i} />)}</div></section><ContactStrip /></>
}

export function ExperienceDetail({ experience }) {
  const next = experiences[(experiences.indexOf(experience) + 1) % experiences.length]
  return <><article className="container detail-page story-page"><a className="back-link" href="#/experiencias"><Icon name="back" size={16} />Todas las experiencias</a><Reveal className="detail-header"><p className="eyebrow">{experience.category}{experience.year && ` / ${experience.year}`}</p><h1>{experience.title}</h1><p className="detail-intro">{experience.intro}</p><div className="story-location"><Icon name="pin" size={17} />{experience.location}</div></Reveal>
      <Reveal className={`story-cover story-${experience.slug}`}><img src={experience.image} alt={experience.name} width="1200" height="800" fetchPriority="high" /></Reveal>
      <div className="article-layout"><aside className="article-sidebar"><div><span className="eyebrow">EL ENCUENTRO</span><p>{experience.name}</p></div>{experience.relatedProject && <a className="text-link" href={`#/proyectos/${experience.relatedProject}`}>Conocer Nich-Ká<Icon name="upRight" size={16} /></a>}{experience.certificate && <Button href={experience.certificate} download="Reconocimiento_Hackathon_Vara_Network.pdf" secondary icon="download">Reconocimiento PDF</Button>}</aside><div className="article-body">{experience.sections.map(([title, text]) => <Reveal key={title}><h2>{title}</h2><p>{text}</p></Reveal>)}{experience.quote && <Reveal><blockquote>“{experience.quote}”</blockquote></Reveal>}{experience.team && <Reveal className="team-block"><h2>Un logro compartido.</h2><p className="eyebrow">EQUIPO DE TRABAJO</p><ul>{experience.team.map(name => <li key={name}>{name}</li>)}</ul><p className="eyebrow">ASESOR</p><p>{experience.advisor}</p></Reveal>}{experience.link && <ExternalLink href={experience.link}>{experience.linkLabel}</ExternalLink>}</div></div>
      <Gallery images={experience.images} />
      <a className="next-story" href={`#/experiencias/${next.slug}`}><div><p className="eyebrow">SIGUIENTE HISTORIA</p><h2>{next.name}</h2></div><Icon name="upRight" size={42} /></a>
    </article><ContactStrip /></>
}
