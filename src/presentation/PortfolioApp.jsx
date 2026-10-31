import { useEffect, useRef, useSyncExternalStore } from 'react'
import { MotionConfig, motion as Motion, useReducedMotion } from 'framer-motion'
import { Header, Footer } from './components/Layout'
import { usePortfolio } from './hooks/usePortfolio.js'
import { getHashPath, subscribeToHash } from './routing/hashRouter.js'
import { resolveRoute } from './routing/resolveRoute.js'
import { Home } from './pages/Home'
import { Projects, ProjectDetail } from './pages/Projects'
import { Experiences, ExperienceDetail } from './pages/Experiences'
import { About } from './pages/About'
import { Contact, NotFound } from './pages/Contact'
import './styles/App.css'

const PAGES = {
  home: Home,
  projects: Projects,
  projectDetail: ProjectDetail,
  experiences: Experiences,
  experienceDetail: ExperienceDetail,
  about: About,
  contact: Contact,
  notFound: NotFound,
}

export function PortfolioApp() {
  const path = useSyncExternalStore(subscribeToHash, getHashPath, () => '/')
  const portfolio = usePortfolio()
  const reduced = useReducedMotion()
  const main = useRef(null)
  const lastPath = useRef(path)
  const { name, props } = resolveRoute(path, portfolio)
  const Page = PAGES[name]

  useEffect(() => {
    document.title = `Fabricio Pérez`
    if (lastPath.current !== path) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      main.current?.focus({ preventScroll: true })
      lastPath.current = path
    }
  }, [path])

  return <MotionConfig reducedMotion="user" transition={{ type: 'spring', bounce: 0, duration: 0.35 }}>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); main.current?.scrollIntoView() }}>Saltar al contenido</a>
    <Header path={path} key={`header-${path}`} />
    <main id="main-content" ref={main} tabIndex={-1}><Motion.div key={path} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}><Page {...props} /></Motion.div></main>
    <Footer />
  </MotionConfig>
}

