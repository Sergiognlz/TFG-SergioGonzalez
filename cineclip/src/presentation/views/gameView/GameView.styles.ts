import { StyleSheet } from 'react-native';

/**
 * Estilos de GameView.
 * Layout sin scroll: todos los elementos se distribuyen
 * proporcionalmente en la altura disponible de la pantalla.
 * Estética cine años 80: neones, negro profundo y tipografía bold.
 */
export const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#0A0A0F',
  padding: 8,
  gap: 6,
},
  centered: {
    flex: 1,
    backgroundColor: '#0A0A0F',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF006E',
    letterSpacing: 6,
    textShadowColor: '#FF006E',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aliasText: {
    color: '#00F5FF',
    fontSize: 13,
    letterSpacing: 1,
  },
  rankingLink: {
    color: '#FFE600',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  logoutLink: {
    color: '#FF006E',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
backdropContainer: {
  marginBottom: 8,
  overflow: 'hidden',
  borderRadius: 4,
},
hintsContainer: {
  flexShrink: 1,
},
  loadingText: {
    color: '#888899',
    marginTop: 12,
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  errorText: {
    color: '#FF006E',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  retryButton: {
    backgroundColor: '#FF006E',
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FF006E',
    marginTop: 6,
  },
  skipText: {
    color: '#FF006E',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  hintsOverlay: {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(10, 10, 15, 0.85)',
  borderRadius: 4,
  padding: 8,
  borderWidth: 1,
  borderColor: '#00F5FF',
  maxWidth: 200,
},
hintOverlayText: {
  color: '#00F5FF',
  fontSize: 11,
  letterSpacing: 1,
  marginBottom: 2,
},
});