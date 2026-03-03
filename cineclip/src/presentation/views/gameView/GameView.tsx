import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useGame } from '../../viewModels/useGame';
import { useSearch } from '../../viewModels/useSearch';
import { BackdropImage } from '../../components/BackdropImage/BackdropImage';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import { ScoreCard } from '../../components/ScoreCard/ScoreCard';
import { Game } from '../../../domain/entities/Game';
import { styles } from './GameView.styles';

interface GameViewProps {
  alias: string;
  initialGame: Game | null;
  initialSessionScore: number;
  onGameStateChange: (game: Game | null, sessionScore: number) => void;
  onGameOver: (game: Game) => void;
  onGoToRanking: () => void;
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
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (!initialGame) {
      initGame();
    }
  }, []);

  useEffect(() => {
    if (game?.result === 'loss') {
      onGameOver(game);
    }
  }, [game?.result]);

  const currentBackdropUrl = game?.movie.backdrops[game.currentBackdropIndex]
    ?? game?.movie.backdrops[0];

  /**
   * Detectar modo horizontal solo en móvil.
   * En web siempre es false para evitar estilos compactos en escritorio.
   */
  const isLandscape = Platform.OS !== 'web' && width > height;

  /** En pantallas pequeñas o landscape el overlay de pistas ocupa menos espacio. */
  const hintsMaxWidth = isLandscape ? 150 : width < 768 ? 160 : 320;
  const hintsFontSize = isLandscape ? 9 : width < 768 ? 10 : 15;

/** Tamaño del título CineClip según plataforma y tamaño de pantalla.
 * Web móvil (<600px): 22px para que quepan los links del header.
 * Web escritorio: 48px tamaño completo.
 * Móvil nativo landscape: 20px compacto.
 * Móvil nativo portrait: 22px igual que web móvil.
 */
const titleFontSize = Platform.OS === 'web'
  ? (width < 600 ? 22 : 48)   // web móvil : web escritorio
  : isLandscape ? 20 : 22;     // móvil landscape : móvil portrait

/** Tamaño de los links del header (alias, Ranking, Salir) según plataforma y tamaño.
 * Web móvil (<600px): 11px para evitar que se salgan de pantalla.
 * Web escritorio: 20px tamaño completo.
 * Móvil nativo landscape: 10px compacto.
 * Móvil nativo portrait: 11px igual que web móvil.
 */
const headerLinkFontSize = Platform.OS === 'web'
  ? (width < 600 ? 11 : 20)   // web móvil : web escritorio
  : isLandscape ? 10 : 11;     // móvil landscape : móvil portrait
  /**
   * Ancho máximo del contenedor en web según tamaño de pantalla.
   * Móvil web (<600px): 480px. Tablet/escritorio: 900px.
   * En móvil nativo no se aplica límite.
   */
  const containerMaxWidth = Platform.OS === 'web'
    ? (width < 600 ? 480 : 900)
    : undefined;

  /**
   * En móvil el backdrop tiene altura fija proporcional a la pantalla.
   * En web usa flex:1 para ocupar todo el espacio sobrante disponible.
   */
  const backdropStyle = Platform.OS === 'web'
    ? styles.backdropContainer
    : [styles.backdropContainer, {
        flex: 0,
        height: isLandscape ? height * 0.45 : height * 0.35,
        width: width - 32,
      }];

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
    <View style={[
      styles.container,
      Platform.OS !== 'web' && { justifyContent: 'space-between' },
      Platform.OS === 'web' && {
        maxWidth: containerMaxWidth,
        alignSelf: 'center',
        width: '100%',
      },
    ]}>
      {/* Título, usuario y botones de navegación */}
      <View style={[styles.header, isLandscape && { marginBottom: 2 }]}>
        <Text style={[styles.title, { fontSize: titleFontSize }]}>CineClip</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.aliasText, { fontSize: headerLinkFontSize }]}>👤 {alias}</Text>
          <TouchableOpacity onPress={onGoToRanking}>
            <Text style={[styles.rankingLink, { fontSize: headerLinkFontSize }]}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <Text style={[styles.logoutLink, { fontSize: headerLinkFontSize }]}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Backdrop adaptado según plataforma y orientación */}
      <View style={backdropStyle}>
        <BackdropImage url={currentBackdropUrl ?? ''} />
        {game.hintsRevealed.length > 0 && (
          <View style={[styles.hintsOverlay, { maxWidth: hintsMaxWidth }]}>
            {game.hintsRevealed.map((hint, index) => (
              <Text key={index} style={[styles.hintOverlayText, { fontSize: hintsFontSize }]}>
                • {hint}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Elementos inferiores: ScoreCard, SearchInput y botón Pasar */}
      <View style={[styles.bottomContainer, isLandscape && { gap: 4, paddingBottom: 8 }]}>
        <ScoreCard
          score={sessionScore}
          attemptsLeft={game.attemptsLeft}
          compact={isLandscape}
        />
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
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => handleAnswer(-1)}
        >
          <Text style={styles.skipText}>Pasar →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return content;
}