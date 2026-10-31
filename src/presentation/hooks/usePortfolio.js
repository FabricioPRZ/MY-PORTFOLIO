import { useContext } from 'react'
import { PortfolioContext } from '../context/PortfolioContext.js'

export function usePortfolio() {
  const portfolio = useContext(PortfolioContext)
  if (!portfolio) throw new Error('Portfolio components require a PortfolioProvider')
  return portfolio
}
