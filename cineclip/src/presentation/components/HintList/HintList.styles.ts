import { StyleSheet } from 'react-native';

/**
 * Estilos de HintList.
 * Estética cine años 80: neones, negro profundo y tipografía bold.
 */
export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#0F0F1A',
    borderRadius: 4,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#222233',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bullet: {
    color: '#00F5FF',
    fontSize: 16,
    marginRight: 8,
    textShadowColor: '#00F5FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 13,
    letterSpacing: 1,
  },
});