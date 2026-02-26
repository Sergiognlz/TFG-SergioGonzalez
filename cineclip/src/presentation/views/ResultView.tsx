import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Game } from '../../domain/entities/Game';

/**
 * Props de ResultView.
 */
interface ResultViewProps {
  /** Estado final de la partida con todos los datos. */
  game: Game;
  /** Función llamada al pulsar "Nueva partida". */
  onNewGame: () => void;
  /** Función llamada para navegar al ranking. */
  onGoToRanking: () => void;
}

/**
 * Vista de resultado de la partida.
 * Muestra si el jugador ha ganado o perdido, la puntuación obtenida
 * y los metadatos completos de la película en español.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * el resultado final de la partida.
 */
export function ResultView({ game, onNewGame, onGoToRanking }: ResultViewProps) {
  const isWin = game.result === 'win';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Resultado principal */}
      <View style={[styles.resultBanner, isWin ? styles.winBanner : styles.lossBanner]}>
        <Text style={styles.resultEmoji}>{isWin ? '🎬' : '😞'}</Text>
        <Text style={styles.resultTitle}>
          {isWin ? '¡Correcto!' : '¡Tiempo agotado!'}
        </Text>
        {isWin && (
          <Text style={styles.scoreText}>+{game.score} puntos</Text>
        )}
      </View>

      {/* Metadatos de la película */}
      <View style={styles.movieCard}>
        <Text style={styles.movieTitle}>{game.movie.title}</Text>
        {game.movie.originalTitle !== game.movie.title && (
          <Text style={styles.originalTitle}>({game.movie.originalTitle})</Text>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Año</Text>
          <Text style={styles.metaValue}>{game.movie.year}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Director</Text>
          <Text style={styles.metaValue}>{game.movie.director}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Género</Text>
          <Text style={styles.metaValue}>{game.movie.genre}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Reparto</Text>
          <Text style={styles.metaValue}>{game.movie.cast.join(', ')}</Text>
        </View>
      </View>

      {/* Botones de acción */}
      <TouchableOpacity style={styles.primaryButton} onPress={onNewGame}>
        <Text style={styles.primaryButtonText}>Nueva partida</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onGoToRanking}>
        <Text style={styles.secondaryButtonText}>Ver ranking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A3A5C',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  resultBanner: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  winBanner: {
    backgroundColor: '#1E5C2A',
  },
  lossBanner: {
    backgroundColor: '#5C1E1E',
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 22,
    color: '#F9A825',
    fontWeight: 'bold',
  },
  movieCard: {
    backgroundColor: '#1E3A5C',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  originalTitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#2A4A6C',
    paddingBottom: 8,
  },
  metaLabel: {
    color: '#F9A825',
    fontSize: 14,
    fontWeight: 'bold',
  },
  metaValue: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  primaryButton: {
    backgroundColor: '#F9A825',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#1A3A5C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F9A825',
  },
  secondaryButtonText: {
    color: '#F9A825',
    fontSize: 16,
  },
});