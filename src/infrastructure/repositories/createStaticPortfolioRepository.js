function freezeDeep(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeDeep)
    Object.freeze(value)
  }
  return value
}

/**
 * Snapshot the source once so consumers cannot mutate shared content.
 * @returns {import('../../application/ports/portfolioRepository.js').PortfolioRepository}
 */
export function createStaticPortfolioRepository(content) {
  const snapshot = freezeDeep(structuredClone(content))

  return Object.freeze({
    getProfile: () => snapshot.profile,
    getProjects: () => snapshot.projects,
    getExperiences: () => snapshot.experiences,
    getExpertise: () => snapshot.expertise,
    getTimeline: () => snapshot.timeline,
  })
}
