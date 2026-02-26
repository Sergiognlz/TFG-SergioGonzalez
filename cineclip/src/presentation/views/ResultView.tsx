import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Game } from '../../domain/entities/Game';
import { styles } from './ResultView.styles';
/**
 * Props de ResultView.
 */
interface ResultViewProps {
  /** Estado final de la partida con todos los datos. */
  game: Game;
  /** Alias del jugador activo. Se muestra en la cabecera. */
  alias: string;
  /** Función llamada al pulsar "Jugar de nuevo". */
  onNewGame: () => void;
  /** Función llamada para navegar al ranking. */
  onGoToRanking: () => void;
  /** Función llamada para cerrar sesión y volver al login. */
  onLogout: () => void;
}

/**
 * Vista de resultado de la partida.
 * Muestra el resultado final (GAME OVER o victoria), la puntuación
 * acumulada en la sesión y los metadatos completos de la película
 * que no se pudo adivinar.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * el resultado final de la sesión.
 */
export function ResultView({ game, alias, onNewGame, onGoToRanking, onLogout }: ResultViewProps) {
  const isWin = game.result === 'win';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Cabecera con usuario y botón de salir */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CineClip</Text>
        <View style={styles.headerRight}>
          <Text style={styles.aliasText}>👤 {alias}</Text>
          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.logoutLink}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

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

