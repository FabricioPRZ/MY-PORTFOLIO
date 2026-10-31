const STATIC_ROUTES = {
  '/': { name: 'home', title: 'Ingeniería con propósito' },
  '/proyectos': { name: 'projects', title: 'Proyectos' },
  '/experiencias': { name: 'experiences', title: 'Experiencias' },
  '/sobre-mi': { name: 'about', title: 'Sobre mí' },
  '/contacto': { name: 'contact', title: 'Contacto' },
}

export function resolveRoute(path, portfolio) {
  if (Object.hasOwn(STATIC_ROUTES, path)) return { ...STATIC_ROUTES[path], props: {} }

  const projectMatch = /^\/proyectos\/([^/]+)$/.exec(path)
  if (projectMatch) {
    const detail = portfolio.getProjectDetail(projectMatch[1])
    if (detail) return { name: 'projectDetail', title: detail.project.name, props: detail }
  }

  const experienceMatch = /^\/experiencias\/([^/]+)$/.exec(path)
  if (experienceMatch) {
    const detail = portfolio.getExperienceDetail(experienceMatch[1])
    if (detail) return { name: 'experienceDetail', title: detail.experience.name, props: detail }
  }

  return { name: 'notFound', title: 'Página no encontrada', props: {} }
}
