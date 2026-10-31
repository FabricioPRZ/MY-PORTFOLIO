import { createContext } from 'react'

/** @type {import('react').Context<ReturnType<import('../../application/use-cases/createPortfolioUseCases.js').createPortfolioUseCases> | null>} */
export const PortfolioContext = createContext(null)
