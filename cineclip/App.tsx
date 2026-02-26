import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { AliasView } from './src/presentation/views/aliasView/AliasView';
import { GameView } from './src/presentation/views/gameView/GameView';
import { ResultView } from './src/presentation/views/resultView/ResultView';
import { RankingView } from './src/presentation/views/rankingView/RankingView';
import { Game } from './src/domain/entities/Game';

/**
 * Pantallas posibles de la aplicación.
 */
type Screen = 'alias' | 'game' | 'result' | 'ranking';

/** Clave usada para guardar el alias en AsyncStorage. */
const ALIAS_KEY = 'cineclip_alias';

/**
 * Punto de entrada de la aplicación CineClip.
 * Gestiona la navegación y el estado de la partida activa.
 * El estado del juego vive aquí para que sobreviva a los
 * cambios de pantalla (por ejemplo al visitar el ranking).
 * Siguiendo el principio de Responsabilidad Única (SOLID - S),
 * App.tsx solo se ocupa de la navegación y el estado global.
 */
export default function App() {
  /** Pantalla actualmente visible. */
  const [screen, setScreen] = useState<Screen>('alias');

  /** Pantalla desde la que se navegó al ranking. */
  const [previousScreen, setPreviousScreen] = useState<Screen>('game');

  /** Alias del jugador registrado. */
  const [alias, setAlias] = useState<string>('');

  /** Estado de la partida activa. Se mantiene al navegar al ranking. */
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  /** Puntuación acumulada de la sesión activa. */
  const [sessionScore, setSessionScore] = useState(0);

  /** Estado final de la última partida jugada (para ResultView). */
  const [lastGame, setLastGame] = useState<Game | null>(null);

  /** Indica si la app está inicializando. */
  const [initializing, setInitializing] = useState(true);

  /**
   * Al arrancar comprueba si hay un alias guardado en AsyncStorage.
   */
  useEffect(() => {
    const checkSavedAlias = async () => {
      try {
        const savedAlias = await AsyncStorage.getItem(ALIAS_KEY);
        if (savedAlias) {
          setAlias(savedAlias);
          setScreen('game');
        }
      } catch (e) {
        // Si falla AsyncStorage mostramos la pantalla de alias
      } finally {
        setInitializing(false);
      }
    };
    checkSavedAlias();
  }, []);

  /**
   * Navega al juego tras registrarse.
   */
  const handleRegistered = async (registeredAlias: string) => {
    await AsyncStorage.setItem(ALIAS_KEY, registeredAlias);
    setAlias(registeredAlias);
    setScreen('game');
  };

  /**
   * Recibe los cambios de estado del juego desde useGame.
   * Mantiene el estado aunque se cambie de pantalla.
   */
  const handleGameStateChange = (game: Game | null, score: number) => {
    setActiveGame(game);
    setSessionScore(score);
  };

  /**
   * Navega a ResultView cuando hay game over.
   */
  const handleGameOver = (game: Game) => {
    setLastGame(game);
    setActiveGame(null);
    setSessionScore(0);
    setScreen('result');
  };

  /**
   * Reinicia el juego con una nueva sesión.
   */
  const handleNewGame = () => {
    setLastGame(null);
    setActiveGame(null);
    setSessionScore(0);
    setScreen('game');
  };

  /**
   * Cierra la sesión del jugador actual.
   */
  const handleLogout = async () => {
    await AsyncStorage.removeItem(ALIAS_KEY);
    setAlias('');
    setLastGame(null);
    setActiveGame(null);
    setSessionScore(0);
    setScreen('alias');
  };

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#FF006E" />
      </View>
    );
  }

  return (
    <>
      {screen === 'alias' && (
        <AliasView onRegistered={handleRegistered} />
      )}
      {screen === 'game' && (
        <GameView
          alias={alias}
          initialGame={activeGame}
          initialSessionScore={sessionScore}
          onGameStateChange={handleGameStateChange}
          onGameOver={handleGameOver}
          onLogout={handleLogout}
          onGoToRanking={() => {
            setPreviousScreen('game');
            setScreen('ranking');
          }}
        />
      )}
      {screen === 'result' && lastGame && (
        <ResultView
          game={lastGame}
          alias={alias}
          onNewGame={handleNewGame}
          onLogout={handleLogout}
          onGoToRanking={() => {
            setPreviousScreen('result');
            setScreen('ranking');
          }}
        />
      )}
      {screen === 'ranking' && (
        <RankingView
          alias={alias}
          onBack={() => setScreen(previousScreen)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}