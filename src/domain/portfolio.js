/**
 * Portfolio entities are plain data, independent of React and storage.
 * Editorial fields (copy, images, links) travel with each entity unchanged.
 *
 * @typedef {Object} Project
 * @property {string} slug Stable identity, independent of array position.
 * @property {string} name
 * @property {string} category
 * @property {string | null} url
 * @property {string[]} [related] Experience identities.
 *
 * @typedef {Object} Experience
 * @property {string} slug
 * @property {string} name
 * @property {string} [relatedProject]
 *
 * @typedef {Object} Profile
 * @property {string} name
 * @property {string} shortName
 * @property {string} email
 * @property {string} phone
 * @property {string} location
 * @property {string} github
 * @property {string} linkedin
 * @property {string} cv
 */

export const PROJECT_CATEGORIES = Object.freeze([
  'Desarrollo web',
  'Investigación',
  'Open source',
  'Universidad',
])

/** @template {{ slug: string }} T
 * @param {readonly T[]} items
 * @param {string} slug
 * @returns {T | null}
 */
export function findBySlug(items, slug) {
  return items.find(item => item.slug === slug) ?? null
}

/** @template {{ slug: string }} T
 * @param {readonly T[]} items
 * @param {string} slug
 * @returns {T | null}
 */
export function nextBySlug(items, slug) {
  const index = items.findIndex(item => item.slug === slug)
  return index === -1 ? null : items[(index + 1) % items.length]
}

/** @param {readonly Project[]} projects
 * @param {string | null} category Null selects the entire catalog.
 */
export function filterProjects(projects, category = null) {
  return projects.filter(project => category === null || project.category === category)
}

/** Keep the established order; include new categories without changing the UI. */
export function projectCategories(projects) {
  return [...new Set([...PROJECT_CATEGORIES, ...projects.map(project => project.category)])]
}

/** @param {Project} project
 * @param {readonly Experience[]} experiences
 */
export function relatedExperiences(project, experiences) {
  const identities = new Set(project.related ?? [])
  return experiences.filter(experience => identities.has(experience.slug))
}
