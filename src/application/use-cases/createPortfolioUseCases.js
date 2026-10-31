import {
  filterProjects,
  findBySlug,
  nextBySlug,
  projectCategories,
  relatedExperiences,
} from '../../domain/portfolio.js'

/** @param {import('../ports/portfolioRepository.js').PortfolioRepository} repository */
export function createPortfolioUseCases(repository) {
  return Object.freeze({
    getProfile() {
      return repository.getProfile()
    },

    getHomePage() {
      return {
        profile: repository.getProfile(),
        projects: repository.getProjects().slice(0, 4),
        experiences: repository.getExperiences().slice(0, 3),
        expertise: repository.getExpertise(),
      }
    },

    getAboutPage() {
      return {
        profile: repository.getProfile(),
        expertise: repository.getExpertise(),
        timeline: repository.getTimeline(),
      }
    },

    listProjects(category = null) {
      const projects = repository.getProjects()
      return {
        projects: filterProjects(projects, category),
        total: projects.length,
        categories: projectCategories(projects).map(value => ({
          value,
          count: filterProjects(projects, value).length,
        })),
      }
    },

    getProjectDetail(slug) {
      const projects = repository.getProjects()
      const project = findBySlug(projects, slug)
      if (!project) return null

      return {
        project,
        related: relatedExperiences(project, repository.getExperiences()),
        next: nextBySlug(projects, slug),
      }
    },

    listExperiences() {
      return repository.getExperiences()
    },

    getExperienceDetail(slug) {
      const experiences = repository.getExperiences()
      const experience = findBySlug(experiences, slug)
      if (!experience) return null

      return {
        experience,
        next: nextBySlug(experiences, slug),
      }
    },
  })
}
