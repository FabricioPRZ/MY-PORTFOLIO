import { PortfolioContext } from './PortfolioContext.js'

export function PortfolioProvider({ portfolio, children }) {
  return <PortfolioContext.Provider value={portfolio}>{children}</PortfolioContext.Provider>
}
