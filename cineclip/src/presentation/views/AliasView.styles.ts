import { StyleSheet } from 'react-native';

/**
 * Estilos de AliasView.
 * Separados del componente siguiendo el principio de
 * Responsabilidad Única (SOLID - S).
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A3A5C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 48,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#0F2A45',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: '#F9A825',
  },
  modeButtonText: {
    color: '#AAAAAA',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modeButtonTextActive: {
    color: '#1A3A5C',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E3A5C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A4A6C',
  },
  error: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#F9A825',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#1A3A5C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
});