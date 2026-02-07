import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './engine/errorBoundary';
import { usePlaySessionStore } from './stores/playSessionStore';
import { MenuScreen } from './features/menu/MenuScreen';
import { GameScreen } from './features/gameplay/GameScreen';
import { GameResultScreen } from './features/gameplay/GameResultScreen';
import { GameRoute } from './features/routing/GameRoute';

const App: React.FC = () => {
  const gameState = usePlaySessionStore(state => state.gameState);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={
          <>
            {gameState === 'menu' && <MenuScreen />}
            {gameState === 'playing' && <GameScreen />}
            {gameState === 'game_over' && <GameResultScreen type="gameOver" />}
          </>
        } />
        <Route path="/games/:gameSlug" element={<GameRoute />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;