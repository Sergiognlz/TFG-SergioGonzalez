import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Game } from '../../../domain/entities/Game';
import { styles } from './ResultView.styles';

interface ResultViewProps {
  game: Game;
  alias: string;
  onNewGame: () => void;
  onGoToRanking: () => void;
  onLogout: () => void;
}

/**
 * Vista de resultado de la partida.
 * Muestra el resultado final, la puntuación acumulada y los
 * metadatos completos de la película.
 * Responsabilidad única (SOLID - S): solo renderiza el resultado final.
 */
export function ResultView({ game, alias, onNewGame, onGoToRanking, onLogout }: ResultViewProps) {
  const isWin = game.result === 'win';
  const { width } = useWindowDimensions();

  /**
   * Ancho máximo del contenedor en web según tamaño de pantalla.
   * Móvil web (<600px): 480px. Tablet/escritorio: 900px.
   */
  const containerMaxWidth = Platform.OS === 'web'
    ? (width < 600 ? 480 : 900)
    : undefined;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        Platform.OS === 'web' && {
          maxWidth: containerMaxWidth,
          alignSelf: 'center',
          width: '100%',
        },
      ]}
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