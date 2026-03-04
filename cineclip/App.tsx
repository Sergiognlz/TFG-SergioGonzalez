import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AliasView } from './src/presentation/views/aliasView/AliasView';
import { GameView } from './src/presentation/views/gameView/GameView';
import { ResultView } from './src/presentation/views/resultView/ResultView';
import { RankingView } from './src/presentation/views/rankingView/RankingView';
import { Game } from './src/domain/entities/Game';
import { auth } from './src/infrastructure/config/firebaseConfig';

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

  /** Carga de la fuente Bebas Neue para el título estilo Hollywood. */
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
  });

  /**
   * Al arrancar escucha el estado de Firebase Auth.
   * Si hay sesión activa recupera el alias de AsyncStorage y navega al juego.
   * Si no hay sesión muestra la pantalla de login/registro.
   * onAuthStateChanged se encarga de detectar la sesión persistida
   * automáticamente sin necesidad de guardar la contraseña.
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const savedAlias = await AsyncStorage.getItem(ALIAS_KEY);
          if (savedAlias) {
            setAlias(savedAlias);
            setScreen('game');
          }
        } catch (e) {
          // Si falla AsyncStorage mostramos la pantalla de alias
        }
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  /**
   * Navega al juego tras registrarse o hacer login.
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
   * Elimina el alias de AsyncStorage y cierra sesión en Firebase Auth.
   */
  const handleLogout = async () => {
    await AsyncStorage.removeItem(ALIAS_KEY);
    await auth.signOut();
    setAlias('');
    setLastGame(null);
    setActiveGame(null);
    setSessionScore(0);
    setScreen('alias');
  };

  /** Mostrar spinner mientras se inicializa o cargan las fuentes. */
  if (initializing || !fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#FF006E" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0F' }}>
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}