import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AliasView } from './src/presentation/views/aliasView/AliasView';
import { GameView } from './src/presentation/views/gameView/GameView';
import { ResultView } from './src/presentation/views/resultView/ResultView';
import { RankingView } from './src/presentation/views/rankingView/RankingView';
import { Game } from './src/domain/entities/Game';
import { auth } from './src/infrastructure/config/firebaseConfig';
import { authRepository } from './src/di/container';

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
   *
   * Flujo en Android:
   * 1. Si Firebase tiene sesión activa (improbable sin persistencia nativa),
   *    recupera el alias de AsyncStorage o lo extrae del email.
   * 2. Si Firebase NO tiene sesión, intenta restaurarla con las credenciales
   *    guardadas en AsyncStorage tras el último login exitoso.
   * 3. Si no hay credenciales guardadas, muestra la pantalla de login.
   *
   * Flujo en web:
   * Firebase gestiona la sesión via localStorage automáticamente,
   * por lo que onAuthStateChanged siempre recibe el usuario si hay sesión.
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Firebase tiene sesión activa — recupera el alias
        try {
          // Intenta recuperar el alias de AsyncStorage
          let savedAlias = await AsyncStorage.getItem(ALIAS_KEY);

          // Si AsyncStorage no tiene el alias (por ejemplo tras reinstalar la app),
          // lo extrae directamente del email de Firebase (alias@cineclip.app → alias)
          if (!savedAlias && user.email) {
            savedAlias = user.email.replace('@cineclip.app', '');
            // Lo guarda en AsyncStorage para las próximas veces
            await AsyncStorage.setItem(ALIAS_KEY, savedAlias);
          }

          if (savedAlias) {
            setAlias(savedAlias);
            setScreen('game');
          }
        } catch {
          // Si falla AsyncStorage mostramos la pantalla de login
        }
        setInitializing(false);
 } else if (Platform.OS !== 'web') {
  try {
    const saved = await authRepository.getSavedCredentials();
    console.log('🔍 Credenciales guardadas:', saved ? saved.alias : 'ninguna');
    if (saved) {
      console.log('🔄 Intentando login silencioso para:', saved.alias);
      await authRepository.login(saved.alias, saved.password);
      return;
    }
  } catch (e) {
    console.log('❌ Login silencioso fallido:', e);
  }
  setInitializing(false);
}
    });
    return unsubscribe;
  }, []);

  /**
   * Navega al juego tras registrarse o hacer login.
   */
  const handleRegistered = async (registeredAlias: string) => {
    // Guarda el alias en AsyncStorage para recuperarlo al arrancar
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
   * Elimina el alias de AsyncStorage, las credenciales guardadas
   * y cierra sesión en Firebase Auth.
   */
  const handleLogout = async () => {
    // Elimina el alias guardado en AsyncStorage
    await AsyncStorage.removeItem(ALIAS_KEY);
    // Cierra sesión en Firebase y elimina credenciales guardadas
    await authRepository.logout();
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