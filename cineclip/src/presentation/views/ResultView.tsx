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
 * Muestra el resultado final (GAME OVER o victoria), la puntuación
 * acumulada en la sesión y los metadatos completos de la película
 * que no se pudo adivinar.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * el resultado final de la sesión.
 */
export function ResultView({ game, onNewGame, onGoToRanking }: ResultViewProps) {
  const isWin = game.result === 'win';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Banner principal de resultado */}
      <View style={[styles.resultBanner, isWin ? styles.winBanner : styles.lossBanner]}>
        {isWin ? (
          <>
            <Text style={styles.resultEmoji}>🎬</Text>
            <Text style={styles.resultTitle}>¡Correcto!</Text>
          </>
        ) : (
          <>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.gameOverSub}>Has perdido</Text>
          </>
        )}

        {/* Puntuación acumulada de la sesión */}
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreLabel}>PUNTUACIÓN FINAL</Text>
          <Text style={styles.scoreValue}>{game.score}</Text>
        </View>
      </View>

      {/* Película que no se pudo adivinar */}
      <View style={styles.movieCard}>
        <Text style={styles.movieCardLabel}>
          {isWin ? 'Película adivinada' : 'La película era...'}
        </Text>
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
        <Text style={styles.primaryButtonText}>Jugar de nuevo</Text>
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
    gap: 8,
  },
  winBanner: {
    backgroundColor: '#1E5C2A',
  },
  lossBanner: {
    backgroundColor: '#1A0A0A',
    borderWidth: 2,
    borderColor: '#FF3333',
  },
  resultEmoji: {
    fontSize: 48,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF3333',
    letterSpacing: 6,
    textShadowColor: '#FF0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  gameOverSub: {
    fontSize: 18,
    color: '#AAAAAA',
    letterSpacing: 2,
  },
  scoreBadge: {
    marginTop: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F9A825',
  },
  scoreLabel: {
    color: '#F9A825',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: 'bold',
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  movieCard: {
    backgroundColor: '#1E3A5C',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  movieCardLabel: {
    color: '#AAAAAA',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
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