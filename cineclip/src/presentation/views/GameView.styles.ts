import { StyleSheet } from 'react-native';

/**
 * Estilos de GameView.
 * Separados del componente siguiendo el principio de
 * Responsabilidad Única (SOLID - S).
 */
export const styles = StyleSheet.create({
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aliasText: {
    color: '#F9A825',
    fontSize: 14,
  },
  rankingLink: {
    color: '#F9A825',
    fontSize: 14,
  },
  logoutLink: {
    color: '#FF6B6B',
    fontSize: 14,
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
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F9A825',
  },
  skipText: {
    color: '#F9A825',
    fontSize: 13,
  },
});