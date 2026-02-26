import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useGame } from '../viewModels/useGame';
import { useSearch } from '../viewModels/useSearch';
import { BackdropImage } from '../components/BackdropImage';
import { SearchInput } from '../components/SearchInput';
import { HintList } from '../components/HintList';
import { ScoreCard } from '../components/ScoreCard';
import { Game } from '../../domain/entities/Game';
import { styles } from './GameView.styles'

/**
 * Props de GameView.
 */
interface GameViewProps {
  /** Alias del jugador activo. Se usa para guardar la puntuación. */
  alias: string;
  /** Función llamada solo cuando el jugador agota los 5 intentos (game over). */
  onGameOver: (game: Game) => void;
  /** Función llamada para navegar al ranking. */
  onGoToRanking: () => void;
  /** Función llamada para cerrar sesión y volver a la pantalla de alias. */
  onLogout: () => void;
}

/**
 * Vista principal del juego.
 * Muestra el backdrop activo, el campo de búsqueda con autocompletado,
 * las pistas acumuladas y el estado de la partida.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * el estado del juego que le proporcionan los ViewModels.
 * La lógica de negocio reside en useGame y useSearch.
 */
export function GameView({ alias, onGameOver, onGoToRanking, onLogout }: GameViewProps) {
  const { game, sessionScore, loading, error, initGame, handleAnswer } = useGame(alias);
  const { results, searching, search, clearResults } = useSearch();

  /** Iniciar la primera partida al montar la vista. */
  useEffect(() => {
    initGame();
  }, []);

  /** Navegar a resultado solo cuando hay game over. */
  useEffect(() => {
    if (game?.result === 'loss') {
      onGameOver(game);
    }
  }, [game?.result]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F9A825" />
        <Text style={styles.loadingText}>Cargando película...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initGame}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!game) return null;

  /** URL del backdrop activo según el índice actual. */
  const currentBackdropUrl = game.movie.backdrops[game.currentBackdropIndex]
    ?? game.movie.backdrops[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
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

      {/* Backdrop de la película */}
      <BackdropImage url={currentBackdropUrl} />

      {/* Estado de la partida: puntuación acumulada e intentos restantes */}
      <ScoreCard
        score={sessionScore}
        attemptsLeft={game.attemptsLeft}
      />

      {/* Pistas desveladas tras cada fallo */}
      <HintList hints={game.hintsRevealed} />

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

      {/* Botón para saltar si no se sabe la película */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => handleAnswer(-1)}
      >
        <Text style={styles.skipText}>Pasar →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

