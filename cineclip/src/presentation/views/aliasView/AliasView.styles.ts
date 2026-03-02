import { StyleSheet } from 'react-native';

/**
 * Estilos de AliasView.
 * Estética cine años 80: neones, negro profundo y tipografía bold.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
 title: {
  fontSize: 80,
  color: '#FF006E',
  letterSpacing: 8,
  fontFamily: 'BebasNeue_400Regular',
  marginBottom: 8,
},
  subtitle: {
    fontSize: 14,
    color: '#00F5FF',
    marginBottom: 48,
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#0F0F1A',
    borderRadius: 4,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FF006E',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 2,
  },
  modeButtonActive: {
    backgroundColor: '#FF006E',
  },
  modeButtonText: {
    color: '#888899',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  label: {
    color: '#00F5FF',
    fontSize: 12,
    marginBottom: 6,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#0F0F1A',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333355',
  },
  error: {
    color: '#FF006E',
    fontSize: 13,
    marginBottom: 12,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#FF006E',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    color: '#888899',
    fontSize: 13,
    letterSpacing: 1,
  },
 signatureText: {
  fontSize: 13,
  fontWeight: '100', // El nivel más bajo de grosor
  color: '#FFFFFF',
  textShadowColor: 'rgba(255, 255, 255, 0.3)', 
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 4, // Un aura tenue, no un brillo neón
  letterSpacing: 4,
  marginTop: 30,    // Empuja el nombre hacia abajo, alejándolo de lo que esté arriba
  marginBottom: 20, // Separa el nombre del borde inferior de la pantalla
},
});