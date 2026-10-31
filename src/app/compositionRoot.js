import { createPortfolioUseCases } from '../application/use-cases/createPortfolioUseCases.js'
import { createStaticPortfolioRepository } from '../infrastructure/repositories/createStaticPortfolioRepository.js'
import { profile, projects, experiences, expertise, timeline } from '../infrastructure/content/portfolio.js'

// Only the composition root knows both the application and its concrete adapter.
const repository = createStaticPortfolioRepository({
  profile,
  projects,
  experiences,
  expertise,
  timeline,
})

export const portfolio = createPortfolioUseCases(repository)
