import { StyleSheet } from 'react-native';

/**
 * Estilos de ResultView.
 * Separados del componente siguiendo el principio de
 * Responsabilidad Única (SOLID - S).
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A3A5C',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aliasText: {
    color: '#F9A825',
    fontSize: 14,
  },
  logoutLink: {
    color: '#FF6B6B',
    fontSize: 14,
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