import { StyleSheet } from 'react-native';

/**
 * Estilos de GameView.
 * Layout sin scroll: todos los elementos se distribuyen
 * proporcionalmente en la altura disponible de la pantalla.
 * Estética cine años 80: neones, negro profundo y tipografía bold.
 */
export const styles = StyleSheet.create({
  /** Contenedor principal. Flex column para que el backdrop ocupe el espacio sobrante. */
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    padding: 16,
    paddingBottom: 32,
  },
  /** Contenedor centrado para estados de carga y error. */
  centered: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  /** Cabecera con título y botones de navegación. */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  /** Contenedor derecho del header con alias y botones. */
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  /** Título principal con fuente Hollywood. */
/** Título principal con fuente Hollywood. */
title: {
  fontSize: 48,
  color: '#FF006E',
  letterSpacing: 8,
  fontFamily: 'BebasNeue_400Regular',
},
/** Texto del alias del jugador. */
aliasText: {
  color: '#00F5FF',
  fontSize: 20,
  letterSpacing: 1,
},
/** Enlace al ranking. */
rankingLink: {
  color: '#FFE600',
  fontSize: 20,
  letterSpacing: 1,
  textTransform: 'uppercase',
},
/** Enlace para cerrar sesión. */
logoutLink: {
  color: '#FF006E',
  fontSize: 20,
  letterSpacing: 1,
  textTransform: 'uppercase',
},
  /** Backdrop ocupa el espacio disponible entre header y bottomContainer. */
  backdropContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  /** Overlay flotante de pistas sobre el backdrop. */
  hintsOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(10, 10, 15, 0.85)',
    borderRadius: 4,
    padding: 6,
    borderWidth: 1,
    borderColor: '#00F5FF',
  },
  /**
   * Texto de cada pista.
   * Sin fontSize fijo para que el tamaño dinámico de GameView.tsx tenga efecto.
   */
  hintOverlayText: {
    color: '#00F5FF',
    letterSpacing: 1,
    marginBottom: 2,
  },
  /** Contenedor de ScoreCard, SearchInput y botón Pasar. */
  bottomContainer: {
    gap: 12,
    paddingBottom: 16,
  },
  /** Texto de carga. */
  loadingText: {
    color: '#888899',
    marginTop: 12,
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  /** Texto de error. */
  errorText: {
    color: '#FF006E',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  /** Botón de reintento tras error. */
  retryButton: {
    backgroundColor: '#FF006E',
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  /** Texto del botón de reintento. */
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  /** Botón para saltar la película actual. */
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: '#FF006E',
    borderWidth: 0,
  },
  /** Texto del botón de saltar. */
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: 'BebasNeue_400Regular',
  },
});