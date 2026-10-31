/**
 * Read-only, synchronous contract for the locally loaded portfolio.
 * Use cases receive this port; they never construct or import an adapter.
 * Adapters must return immutable records or isolated copies.
 *
 * @typedef {Object} PortfolioRepository
 * @property {() => import('../../domain/portfolio.js').Profile} getProfile
 * @property {() => readonly import('../../domain/portfolio.js').Project[]} getProjects
 * @property {() => readonly import('../../domain/portfolio.js').Experience[]} getExperiences
 * @property {() => readonly object[]} getExpertise
 * @property {() => readonly object[]} getTimeline
 */

export {}
