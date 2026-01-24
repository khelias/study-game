import SmartAdventure from './SmartAdventure'
import { ErrorBoundary } from './engine/errorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <SmartAdventure />
    </ErrorBoundary>
  )
}

export default App