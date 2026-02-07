import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useGameStore } from '../../stores/gameStore';
import { GameScreen } from '../gameplay/GameScreen';
import { GameOverScreen } from '../gameplay/GameOverScreen';
import { slugToGameId, isValidGameSlug } from '../../utils/gameSlug';
import { GAME_CONFIG } from '../../games/data';

/**
 * GameRoute component handles direct navigation to a specific game via URL.
 * It initializes the game state and ensures proper profile behavior.
 */
export const GameRoute: React.FC = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();
  const gameState = usePlaySessionStore(state => state.gameState);
  const startGame = usePlaySessionStore(state => state.startGame);
  const recordGameStart = useGameStore(state => state.recordGameStart);
  const hearts = useGameStore(state => state.hearts);

  useEffect(() => {
    // Validate the game slug
    if (!gameSlug) {
      navigate('/');
      return;
    }

    const gameId = slugToGameId(gameSlug);
    const validGameIds = Object.keys(GAME_CONFIG);

    if (!isValidGameSlug(gameSlug, validGameIds)) {
      // Invalid game slug, redirect to menu
      navigate('/');
      return;
    }

    // Check if player has hearts before starting
    if (hearts <= 0) {
      // Redirect to menu where they can buy hearts
      navigate('/');
      return;
    }

    // Only start the game if we're not already in a game state
    if (gameState === 'menu') {
      // Record game start and check for achievements
      recordGameStart(gameId);
      startGame(gameId);
    }
  }, [gameSlug, gameState, navigate, startGame, recordGameStart, hearts]);

  // Render appropriate screen based on game state
  if (gameState === 'playing') {
    return <GameScreen />;
  }

  if (gameState === 'game_over') {
    return <GameOverScreen />;
  }

  // While initializing, show nothing (will redirect if invalid)
  return null;
};
