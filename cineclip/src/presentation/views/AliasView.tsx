import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { loginUser, registerUser } from '../../di/container';

/**
 * Props de AliasView.
 */
interface AliasViewProps {
  /** Función llamada cuando el jugador se autentica correctamente.
   * Recibe el alias para pasarlo al resto de la app. */
  onRegistered: (alias: string) => void;
}

/**
 * Modos posibles del formulario.
 * - 'login': el jugador ya tiene cuenta y quiere iniciar sesión.
 * - 'register': el jugador es nuevo y quiere crear una cuenta.
 */
type FormMode = 'login' | 'register';

/**
 * Vista de autenticación.
 * Permite al jugador registrarse con un alias y contraseña nuevos,
 * o iniciar sesión si ya tiene cuenta.
 * Responsabilidad única (SOLID - S): solo gestiona la autenticación
 * antes de acceder al juego.
 */
export function AliasView({ onRegistered }: AliasViewProps) {
  /** Modo actual del formulario: login o registro. */
  const [mode, setMode] = useState<FormMode>('login');

  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Gestiona el envío del formulario según el modo activo.
   * En modo registro crea la cuenta y el perfil del jugador.
   * En modo login valida las credenciales existentes.
   */
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        await registerUser.execute(alias, password);
      } else {
        await loginUser.execute(alias, password);
      }
      onRegistered(alias.trim());
    } catch (e: any) {
      setError(e.message ?? 'Error al autenticar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambia entre modo login y registro.
   * Limpia los errores y el formulario al cambiar de modo.
   */
  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setError(null);
    setAlias('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>CineClip</Text>
      <Text style={styles.subtitle}>¿De qué película es este fotograma?</Text>

      <View style={styles.form}>

        {/* Selector de modo login / registro */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
            onPress={() => { setMode('login'); setError(null); }}
          >
            <Text style={[styles.modeButtonText, mode === 'login' && styles.modeButtonTextActive]}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'register' && styles.modeButtonActive]}
            onPress={() => { setMode('register'); setError(null); }}
          >
            <Text style={[styles.modeButtonText, mode === 'register' && styles.modeButtonTextActive]}>
              Registrarse
            </Text>
          </TouchableOpacity>
        </View>

        {/* Campo alias */}
        <Text style={styles.label}>Alias</Text>
        <TextInput
          style={styles.input}
          value={alias}
          onChangeText={setAlias}
          placeholder="Tu alias (3-20 caracteres)"
          placeholderTextColor="#888"
          maxLength={20}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Campo contraseña */}
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#888"
          secureTextEntry
        />

        {/* Mensaje de error */}
        {error && <Text style={styles.error}>{error}</Text>}

        {/* Botón principal */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Enlace para cambiar de modo */}
        <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
          <Text style={styles.toggleText}>
            {mode === 'login'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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