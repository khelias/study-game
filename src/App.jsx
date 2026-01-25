import { ErrorBoundary } from './engine/errorBoundary'
import { usePlaySessionStore } from './stores/playSessionStore'
import { MenuScreen } from './features/menu/MenuScreen'
import { GameScreen } from './features/gameplay/GameScreen'
import { GameOverScreen } from './features/gameplay/GameOverScreen'

function App() {
  const gameState = usePlaySessionStore(state => state.gameState)

  return (
    <ErrorBoundary>
      {gameState === 'menu' && <MenuScreen />}
      {gameState === 'playing' && <GameScreen />}
      {gameState === 'game_over' && <GameOverScreen />}
    </ErrorBoundary>
  )
}

export default App