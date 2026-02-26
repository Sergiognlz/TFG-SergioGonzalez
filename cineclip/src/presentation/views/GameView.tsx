import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useGame } from '../hooks/useGame';
import { useSearch } from '../hooks/useSearch';
import { BackdropImage } from '../components/BackdropImage';
import { SearchInput } from '../components/SearchInput';
import { HintList } from '../components/HintList';
import { ScoreCard } from '../components/ScoreCard';
import { Game } from '../../domain/entities/Game';

/**
 * Props de GameView.
 */
interface GameViewProps {
  /** Alias del jugador activo. Se usa para guardar la puntuación. */
  alias: string;
  
  /** Función llamada cuando la partida termina (win o loss). */
onGameOver: (game: Game) => void;
  /** Función llamada para navegar al ranking. */
  onGoToRanking: () => void;
}

/**
 * Vista principal del juego.
 * Muestra el backdrop activo, el campo de búsqueda con autocompletado,
 * las pistas acumuladas y el estado de la partida.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * el estado del juego que le proporcionan los hooks (ViewModels).
 */
export function GameView({ alias, onGameOver, onGoToRanking }: GameViewProps) {
  const { game, loading, error, initGame, handleAnswer } = useGame(alias);
  const { results, searching, search, clearResults } = useSearch();

  /** Iniciar la primera partida al montar la vista. */
  useEffect(() => {
    initGame();
  }, []);

  /** Navegar a resultado cuando la partida termina. */
useEffect(() => {
  if (game?.result === 'win' || game?.result === 'loss') {
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
      {/* Título y botón de ranking */}
      <View style={styles.header}>
        <Text style={styles.title}>CineClip</Text>
        <TouchableOpacity onPress={onGoToRanking}>
          <Text style={styles.rankingLink}>Ranking</Text>
        </TouchableOpacity>
      </View>

      {/* Backdrop de la película */}
      <BackdropImage url={currentBackdropUrl} />

      {/* Estado de la partida */}
      <ScoreCard
        score={game.score}
        attemptsLeft={game.attemptsLeft}
      />

      {/* Pistas desveladas */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A3A5C',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    backgroundColor: '#1A3A5C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rankingLink: {
    color: '#F9A825',
    fontSize: 16,
  },
  loadingText: {
    color: '#AAAAAA',
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#F9A825',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: '#1A3A5C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});