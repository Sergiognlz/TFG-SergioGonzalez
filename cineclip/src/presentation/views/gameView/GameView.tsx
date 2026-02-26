import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useGame } from '../../viewModels/useGame';
import { useSearch } from '../../viewModels/useSearch';
import { BackdropImage } from '../../components/BackdropImage/BackdropImage';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import { ScoreCard } from '../../components/ScoreCard/ScoreCard';
import { Game } from '../../../domain/entities/Game';
import { styles } from './GameView.styles';

/**
 * Props de GameView.
 */
interface GameViewProps {
  /** Alias del jugador activo. */
  alias: string;
  /** Estado de la partida activa. Null si no hay partida en curso. */
  initialGame: Game | null;
  /** Puntuación acumulada de la sesión activa. */
  initialSessionScore: number;
  /** Función llamada cuando cambia el estado del juego para persistirlo en App. */
  onGameStateChange: (game: Game | null, sessionScore: number) => void;
  /** Función llamada cuando hay game over. */
  onGameOver: (game: Game) => void;
  /** Función llamada para navegar al ranking. */
  onGoToRanking: () => void;
  /** Función llamada para cerrar sesión. */
  onLogout: () => void;
}

/**
 * Vista principal del juego.
 * Recibe el estado de la partida desde App.tsx para que
 * sobreviva a los cambios de pantalla.
 * Responsabilidad única (SOLID - S): solo renderiza el estado
 * que le proporcionan los ViewModels.
 * Un único return: el contenido se calcula en variables previas.
 */
export function GameView({
  alias,
  initialGame,
  initialSessionScore,
  onGameStateChange,
  onGameOver,
  onGoToRanking,
  onLogout,
}: GameViewProps) {
  const { game, sessionScore, loading, error, initGame, handleAnswer } = useGame(
    alias,
    initialGame,
    initialSessionScore,
    onGameStateChange,
  );
  const { results, searching, search, clearResults } = useSearch();
  const { height } = useWindowDimensions();

  /** Solo iniciar partida si no hay ninguna activa. */
  useEffect(() => {
    if (!initialGame) {
      initGame();
    }
  }, []);

  /** Navegar a resultado cuando hay game over. */
  useEffect(() => {
    if (game?.result === 'loss') {
      onGameOver(game);
    }
  }, [game?.result]);

  /** Log temporal para verificar valores que llegan al ScoreCard. */
  console.log('GameView - sessionScore:', sessionScore, 'attemptsLeft:', game?.attemptsLeft);

  /** URL del backdrop activo según el índice actual. */
  const currentBackdropUrl = game?.movie.backdrops[game.currentBackdropIndex]
    ?? game?.movie.backdrops[0];

  /**
   * Contenido principal calculado antes del return.
   * Muestra spinner, error o el juego según el estado.
   */
  const content = loading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#FF006E" />
      <Text style={styles.loadingText}>Cargando película...</Text>
    </View>
  ) : error ? (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={initGame}>
        <Text style={styles.retryText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  ) : !game ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#FF006E" />
    </View>
  ) : (
    <View style={styles.container}>
      {/* Título, usuario y botones de navegación */}
      <View style={styles.header}>
        <Text style={styles.title}>CineClip</Text>
        <View style={styles.headerRight}>
          <Text style={styles.aliasText}>👤 {alias}</Text>
          <TouchableOpacity onPress={onGoToRanking}>
            <Text style={styles.rankingLink}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.logoutLink}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Backdrop con pistas flotantes encima */}
      <View style={[styles.backdropContainer, { height: height * 0.65 }]}>
        <BackdropImage url={currentBackdropUrl ?? ''} />
        {game.hintsRevealed.length > 0 && (
          <View style={styles.hintsOverlay}>
            {game.hintsRevealed.map((hint, index) => (
              <Text key={index} style={styles.hintOverlayText}>• {hint}</Text>
            ))}
          </View>
        )}
      </View>

      {/* Estado de la partida */}
      <ScoreCard
        score={sessionScore}
        attemptsLeft={game.attemptsLeft}
      />

      {/* Campo de búsqueda con autocompletado */}
      <SearchInput
        onSearch={search}
        results={results}
        searching={searching}
        onSelect={movie => {
          clearResults();
          handleAnswer(movie.id);
        }}
        onClear={clearResults}
      />

      {/* Botón para saltar */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => handleAnswer(-1)}
      >
        <Text style={styles.skipText}>Pasar →</Text>
      </TouchableOpacity>
    </View>
  );

  return content;
}