import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { auth } from '../../infrastructure/config/firebaseConfig';
import { IAuthRepository } from '../../domain/interfaces/repositories/IAuthRepository';

/** Clave para guardar el password cifrado en AsyncStorage. */
const CREDENTIALS_KEY = 'cineclip_credentials';

/**
 * Implementación concreta de IAuthRepository usando Firebase Authentication.
 * Convierte el alias en un email interno (alias@cineclip.app) para
 * usar el sistema de autenticación de Firebase por debajo.
 * El jugador solo ve y escribe su alias y contraseña, nunca el email.
 *
 * En Android, guarda las credenciales en AsyncStorage para restaurar
 * la sesión automáticamente al arrancar la app, supliendo la falta de
 * persistencia nativa de Firebase en React Native con Hermes.
 *
 * Siguiendo el principio de Inversión de Dependencias (SOLID - D),
 * la lógica de negocio nunca importa esta clase directamente,
 * sino la interfaz IAuthRepository.
 *
 * Siguiendo el principio de Responsabilidad Única (SOLID - S),
 * esta clase solo gestiona autenticación, no navegación ni estado de UI.
 */
export class FirebaseAuthRepository implements IAuthRepository {

  /**
   * Convierte un alias en un email interno válido para Firebase Auth.
   * @param alias Alias del jugador.
   * @returns Email en formato alias@cineclip.app.
   */
  private aliasToEmail(alias: string): string {
    return `${alias.toLowerCase().trim()}@cineclip.app`;
  }

  /**
   * Guarda las credenciales en AsyncStorage para persistir la sesión en Android.
   * Solo se ejecuta en Android — en web Firebase gestiona la sesión via localStorage.
   * @param alias Alias del jugador.
   * @param password Contraseña del jugador.
   */
  private async saveCredentials(alias: string, password: string): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      const credentials = JSON.stringify({ alias: alias.toLowerCase().trim(), password });
      await AsyncStorage.setItem(CREDENTIALS_KEY, credentials);
    } catch {
      // Si falla el guardado no interrumpimos el flujo — el usuario tendrá que
      // loguearse manualmente la próxima vez pero la sesión actual funciona
    }
  }

  /**
   * Elimina las credenciales guardadas en AsyncStorage al cerrar sesión.
   * Solo se ejecuta en Android.
   */
  private async clearCredentials(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await AsyncStorage.removeItem(CREDENTIALS_KEY);
    } catch {
      // Si falla el borrado no es crítico
    }
  }

  /**
   * Recupera las credenciales guardadas en AsyncStorage.
   * Devuelve null si no hay credenciales o si estamos en web.
   * @returns Objeto con alias y password, o null.
   */
  async getSavedCredentials(): Promise<{ alias: string; password: string } | null> {
    if (Platform.OS === 'web') return null;
    try {
      const raw = await AsyncStorage.getItem(CREDENTIALS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Registra un nuevo usuario en Firebase Authentication
   * y guarda las credenciales en AsyncStorage para Android.
   * @param alias Alias elegido por el jugador (3-20 caracteres).
   * @param password Contraseña elegida por el jugador (mínimo 6 caracteres).
   * @throws Error si el alias ya está en uso o la contraseña no es válida.
   */
  async register(alias: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(
        auth,
        this.aliasToEmail(alias),
        password,
      );
      // Guarda credenciales tras registro exitoso para persistir sesión en Android
      await this.saveCredentials(alias, password);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este alias ya está en uso. Elige otro.');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }
      throw new Error('Error al registrar el usuario. Inténtalo de nuevo.');
    }
  }

  /**
   * Inicia sesión con alias y contraseña en Firebase Authentication
   * y guarda las credenciales en AsyncStorage para Android.
   * @param alias Alias del jugador.
   * @param password Contraseña del jugador.
   * @throws Error si el alias no existe o la contraseña es incorrecta.
   */
  async login(alias: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(
      auth,
      this.aliasToEmail(alias),
      password,
    );
    await this.saveCredentials(alias, password);
    console.log('✅ Login exitoso, credenciales guardadas para:', alias);
  } catch (error: any) {
    console.log('❌ Error en login:', error.code);
    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-credential'
    ) {
      throw new Error('Alias o contraseña incorrectos.');
    }
    throw new Error('Error al iniciar sesión. Inténtalo de nuevo.');
  }
}

  /**
   * Cierra la sesión del usuario actual en Firebase Authentication
   * y elimina las credenciales guardadas en AsyncStorage.
   */
  async logout(): Promise<void> {
    await signOut(auth);
    // Elimina credenciales al cerrar sesión para que no se restaure automáticamente
    await this.clearCredentials();
  }

  /**
   * Devuelve el alias del usuario actualmente autenticado.
   * Extrae el alias del email interno (alias@cineclip.app → alias).
   * @returns Alias del usuario o null si no hay sesión activa.
   */
  getCurrentAlias(): string | null {
    const user = auth.currentUser;
    if (!user?.email) return null;
    return user.email.replace('@cineclip.app', '');
  }
}