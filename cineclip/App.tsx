import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
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

/** Clave usada para guardar el alias en AsyncStorage. */
const ALIAS_KEY = 'cineclip_alias';

/**
 * Punto de entrada de la aplicación CineClip.
 * Gestiona la navegación entre vistas mediante un estado local.
 * Al arrancar comprueba si hay un alias guardado en AsyncStorage
 * para saltar directamente al juego si el jugador ya se registró.
 * Siguiendo el principio de Responsabilidad Única (SOLID - S),
 * App.tsx solo se ocupa de la navegación, nunca de lógica de negocio.
 */
export default function App() {
  /** Pantalla actualmente visible. */
  const [screen, setScreen] = useState<Screen>('alias');

  /** Pantalla desde la que se navegó al ranking. Permite volver al sitio correcto. */
  const [previousScreen, setPreviousScreen] = useState<Screen>('game');

  /** Alias del jugador registrado. */
  const [alias, setAlias] = useState<string>('');

  /** Estado final de la última partida jugada. */
  const [lastGame, setLastGame] = useState<Game | null>(null);

  /** Indica si la app está comprobando el alias guardado al arrancar. */
  const [initializing, setInitializing] = useState(true);

  /**
   * Al arrancar la app, comprueba si hay un alias guardado en AsyncStorage.
   * Si existe, salta directamente al juego sin pedir registro.
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
        // Si falla AsyncStorage mostramos la pantalla de alias igualmente
      } finally {
        setInitializing(false);
      }
    };
    checkSavedAlias();
  }, []);

  /**
   * Navega a la pantalla de juego tras registrar el alias.
   * Guarda el alias en AsyncStorage para futuras sesiones.
   * @param registeredAlias Alias registrado por el jugador.
   */
  const handleRegistered = async (registeredAlias: string) => {
    await AsyncStorage.setItem(ALIAS_KEY, registeredAlias);
    setAlias(registeredAlias);
    setScreen('game');
  };

  /**
   * Navega a la pantalla de resultado cuando termina la partida.
   * @param game Estado final de la partida.
   */
  const handleGameOver = (game: Game) => {
    setLastGame(game);
    setScreen('result');
  };

  /**
   * Reinicia el juego con una nueva partida.
   * Limpia el estado de la última partida antes de navegar.
   */
  const handleNewGame = () => {
    setLastGame(null);
    setScreen('game');
  };

  /**
   * Cierra la sesión del jugador actual.
   * Borra el alias de AsyncStorage y vuelve a la pantalla de registro.
   */
  const handleLogout = async () => {
    await AsyncStorage.removeItem(ALIAS_KEY);
    setAlias('');
    setLastGame(null);
    setScreen('alias');
  };

  /** Mostrar spinner mientras se comprueba el alias guardado. */
  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1A3A5C', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#F9A825" />
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