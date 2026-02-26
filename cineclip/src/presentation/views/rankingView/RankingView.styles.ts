import { StyleSheet } from 'react-native';

/**
 * Estilos de RankingView.
 * Estética cine años 80: neones, negro profundo y tipografía bold.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    color: '#00F5FF',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aliasText: {
    color: '#00F5FF',
    fontSize: 13,
    letterSpacing: 1,
  },
logoutLink: {
  color: '#FF006E',
  fontSize: 13,
  letterSpacing: 1,
  textTransform: 'uppercase',
},
  refreshButton: {
    color: '#FFE600',
    fontSize: 22,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F0F1A',
    marginHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#222233',
  },
  tableHeaderText: {
    color: '#00F5FF',
    fontWeight: 'bold',
    fontSize: 12,
    width: 40,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  flex: {
    flex: 1,
    textAlign: 'left',
  },
  list: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#0F0F1A',
  },
  topRow: {
    backgroundColor: '#0F0F1A',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#222233',
  },
  position: {
    width: 40,
    textAlign: 'center',
    color: '#888899',
    fontSize: 16,
  },
  alias: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
  },
  score: {
    width: 70,
    textAlign: 'right',
    color: '#FFE600',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
    textShadowColor: '#FFE600',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: '#FF006E',
    fontSize: 15,
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
  emptyText: {
    color: '#888899',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 2,
  },
});