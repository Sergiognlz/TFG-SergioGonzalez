import { StyleSheet } from 'react-native';

/**
 * Estilos de RankingView.
 * Separados del componente siguiendo el principio de
 * Responsabilidad Única (SOLID - S).
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A3A5C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    color: '#F9A825',
    fontSize: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
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
  refreshButton: {
    color: '#F9A825',
    fontSize: 22,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1E3A5C',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    color: '#F9A825',
    fontWeight: 'bold',
    fontSize: 14,
    width: 40,
    textAlign: 'center',
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5C',
  },
  topRow: {
    backgroundColor: '#1E3A5C',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  position: {
    width: 40,
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 16,
  },
  alias: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  score: {
    width: 60,
    textAlign: 'right',
    color: '#F9A825',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
  emptyText: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
  },
});