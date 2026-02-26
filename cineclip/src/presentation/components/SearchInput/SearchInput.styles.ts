import { StyleSheet } from 'react-native';

/**
 * Estilos de SearchInput.
 * Estética cine años 80: neones, negro profundo y tipografía bold.
 */
export const styles = StyleSheet.create({
  container: {
  width: '100%',
  zIndex: 999,
},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F1A',
    borderRadius: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FF006E',
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
  },
  spinner: {
    marginLeft: 8,
  },
dropdownWrapper: {
  position: 'absolute',
  bottom: 48,
  left: 0,
  right: 0,
  zIndex: 9999,
  elevation: 9999,
},
dropdown: {
  backgroundColor: '#0F0F1A',
  borderRadius: 4,
  maxHeight: 300,
  borderWidth: 1,
  borderColor: '#FF006E',
  shadowColor: '#FF006E',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.4,
  shadowRadius: 8,
},
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222233',
  },
  resultTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
    letterSpacing: 1,
  },
  resultYear: {
    color: '#00F5FF',
    fontSize: 13,
    marginLeft: 8,
    letterSpacing: 1,
  },
  
});