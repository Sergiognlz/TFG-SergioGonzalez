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
import { registerPlayer } from '../../di/container';

/**
 * Props de AliasView.
 */
interface AliasViewProps {
  /** Función llamada cuando el jugador se registra correctamente.
   * Recibe el alias registrado para pasarlo al resto de la app. */
  onRegistered: (alias: string) => void;
}

/**
 * Vista de registro de alias.
 * Es la primera pantalla que ve el jugador.
 * Responsabilidad única (SOLID - S): solo gestiona
 * el registro del alias antes de empezar a jugar.
 */
export function AliasView({ onRegistered }: AliasViewProps) {
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Gestiona el registro del alias.
   * Llama al caso de uso RegisterPlayer y navega al juego si tiene éxito.
   */
  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      await registerPlayer.execute(alias);
      onRegistered(alias.trim());
    } catch (e: any) {
      setError(e.message ?? 'Error al registrar el alias.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>CineClip</Text>
      <Text style={styles.subtitle}>¿De qué película es este fotograma?</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Elige tu alias para empezar</Text>
        <TextInput
          style={styles.input}
          value={alias}
          onChangeText={setAlias}
          placeholder="Tu alias (3-20 caracteres)"
          placeholderTextColor="#888"
          maxLength={20}
          autoCorrect={false}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Empezar a jugar</Text>
          )}
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
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1E3A5C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
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
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#1A3A5C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});