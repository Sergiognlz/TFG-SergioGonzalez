import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0F0F1A',
    borderRadius: 4,
    paddingVertical: 8,
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
    color: '#FFE600',
    fontSize: 10,
    marginBottom: 2,
    letterSpacing: 4,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  value: {
    color: '#FFE600',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
    fontFamily: 'monospace',
    // @ts-ignore - propiedad web válida
    textShadow: '0 0 8px #FFE600, 0 0 16px #FFE600, 0 0 32px #FFB800',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#222233',
  },
});