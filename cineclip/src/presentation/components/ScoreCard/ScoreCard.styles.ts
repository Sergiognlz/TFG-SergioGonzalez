import { StyleSheet } from 'react-native';

/**
 * Estilos de ScoreCard.
 * Estética cine años 80: neones, negro profundo y tipografía bold.
 */
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0F0F1A',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#222233',
  },
  item: {
    alignItems: 'center',
  },
  label: {
    color: '#888899',
    fontSize: 9,
    marginBottom: 1,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  value: {
    color: '#FFE600',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#222233',
  },
});