import { portfolio } from './compositionRoot.js'
import { PortfolioProvider } from '../presentation/context/PortfolioProvider.jsx'
import { PortfolioApp } from '../presentation/PortfolioApp.jsx'

export default function App() {
  return (
    <PortfolioProvider portfolio={portfolio}>
      <PortfolioApp />
    </PortfolioProvider>
  )
}
