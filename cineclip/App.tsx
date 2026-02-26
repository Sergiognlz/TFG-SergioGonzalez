import React, { useState } from 'react';
import { AliasView } from './src/presentation/views/AliasView';
import { GameView } from './src/presentation/views/GameView';
import { ResultView } from './src/presentation/views/ResultView';
import { RankingView } from './src/presentation/views/RankingView';
import { Game } from './src/domain/entities/Game';

/**
 * Pantallas posibles de la aplicación.
 * Controla qué vista se renderiza en cada momento.
 */
type Screen = 'alias' | 'game' | 'result' | 'ranking';

/**
 * Punto de entrada de la aplicación CineClip.
 * Gestiona la navegación entre vistas mediante un estado local.
 * Siguiendo el principio de Responsabilidad Única (SOLID - S),
 * App.tsx solo se ocupa de la navegación, nunca de lógica de negocio.
 */
export default function App() {
  /** Pantalla actualmente visible. */
  const [screen, setScreen] = useState<Screen>('alias');

  /** Alias del jugador registrado. */
  const [alias, setAlias] = useState<string>('');

  /** Estado final de la última partida jugada. */
  const [lastGame, setLastGame] = useState<Game | null>(null);

  /**
   * Navega a la pantalla de juego tras registrar el alias.
   * @param registeredAlias Alias registrado por el jugador.
   */
  const handleRegistered = (registeredAlias: string) => {
    setAlias(registeredAlias);
    setScreen('game');
  };

  /**
   * Navega a la pantalla de resultado cuando termina la partida.
   * @param score Puntuación obtenida.
   * @param movieTitle Título de la película de la partida.
   */
  const handleGameOver = (game: Game) => {
    setLastGame(game);
    setScreen('result');
  };

  /**
   * Reinicia el juego con una nueva partida.
   */
  const handleNewGame = () => {
    setLastGame(null);
    setScreen('game');
  };

  return (
    <>
      {screen === 'alias' && (
        <AliasView onRegistered={handleRegistered} />
      )}
      {screen === 'game' && (
        <GameView
          alias={alias}
          onGameOver={handleGameOver}
          onGoToRanking={() => setScreen('ranking')}
        />
      )}
      {screen === 'result' && lastGame && (
        <ResultView
          game={lastGame}
          onNewGame={handleNewGame}
          onGoToRanking={() => setScreen('ranking')}
        />
      )}
      {screen === 'ranking' && (
        <RankingView onBack={() => setScreen('game')} />
      )}
    </>
  );
}