import { useEffect, useRef, useSyncExternalStore } from 'react'
import { MotionConfig, motion as Motion, useReducedMotion } from 'framer-motion'
import { Header, Footer } from './components/Layout'
import { projects, experiences } from './data/portfolio'
import { Home } from './pages/Home'
import { Projects, ProjectDetail } from './pages/Projects'
import { Experiences, ExperienceDetail } from './pages/Experiences'
import { About } from './pages/About'
import { Contact, NotFound } from './pages/Contact'
import './App.css'

function subscribe(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getPath() {
  return (window.location.hash.slice(1).split('?')[0] || '/').replace(/\/$/, '') || '/'
}

function resolvePage(path) {
  if (path === '/') return { page: <Home />, title: 'Ingeniería con propósito' }
  if (path === '/proyectos') return { page: <Projects />, title: 'Proyectos' }
  if (path === '/experiencias') return { page: <Experiences />, title: 'Experiencias' }
  if (path === '/sobre-mi') return { page: <About />, title: 'Sobre mí' }
  if (path === '/contacto') return { page: <Contact />, title: 'Contacto' }
  const project = projects.find(item => path === `/proyectos/${item.slug}`)
  if (project) return { page: <ProjectDetail project={project} />, title: project.name }
  const experience = experiences.find(item => path === `/experiencias/${item.slug}`)
  if (experience) return { page: <ExperienceDetail experience={experience} />, title: experience.name }
  return { page: <NotFound />, title: 'Página no encontrada' }
}

function App() {
  const path = useSyncExternalStore(subscribe, getPath, () => '/')
  const reduced = useReducedMotion()
  const main = useRef(null)
  const lastPath = useRef(path)
  const { page, title } = resolvePage(path)

  useEffect(() => {
    document.title = `Fabricio Pérez`
    if (lastPath.current !== path) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      main.current?.focus({ preventScroll: true })
      lastPath.current = path
    }
  }, [path, title])

  return <MotionConfig reducedMotion="user" transition={{ type: 'spring', bounce: 0, duration: 0.35 }}>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); main.current?.scrollIntoView() }}>Saltar al contenido</a>
    <Header path={path} key={`header-${path}`} />
    <main id="main-content" ref={main} tabIndex={-1}><Motion.div key={path} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>{page}</Motion.div></main>
    <Footer />
  </MotionConfig>
}

export default App
