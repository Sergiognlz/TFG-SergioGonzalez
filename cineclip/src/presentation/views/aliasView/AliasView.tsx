import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { loginUser, registerUser } from '../../../di/container';
import { styles } from './AliasView.styles';


interface AliasViewProps {
  onRegistered: (alias: string) => void;
}

type FormMode = 'login' | 'register';

/**
 * Vista de autenticación.
 * Permite al jugador registrarse con un alias y contraseña nuevos,
 * o iniciar sesión si ya tiene cuenta.
 * Responsabilidad única (SOLID - S): solo gestiona la autenticación
 * antes de acceder al juego.
 */
export function AliasView({ onRegistered }: AliasViewProps) {
  const [mode, setMode] = useState<FormMode>('login');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Gestiona el envío del formulario según el modo activo.
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
   * Cambia entre modo login y registro limpiando el formulario.
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
          onChangeText={text => setAlias(text.replace(/\s/g, ''))}
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

        {/* Logo de autor */}
     
{/* Logo de autor */}
<Image
  source={require('../../../../assets/SGLogo.png')}
  style={styles.logo}
/>

      </View>
    </KeyboardAvoidingView>
  );
}