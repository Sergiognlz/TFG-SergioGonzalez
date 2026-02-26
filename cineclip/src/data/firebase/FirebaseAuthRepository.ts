import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../infrastructure/config/firebaseConfig';
import { IAuthRepository } from '../../domain/interfaces/repositories/IAuthRepository';

/**
 * Implementación concreta de IAuthRepository usando Firebase Authentication.
 * Convierte el alias en un email interno (alias@cineclip.app) para
 * usar el sistema de autenticación de Firebase por debajo.
 * El jugador solo ve y escribe su alias y contraseña, nunca el email.
 * Siguiendo el principio de Inversión de Dependencias (SOLID - D),
 * la lógica de negocio nunca importa esta clase directamente,
 * sino la interfaz IAuthRepository.
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
   * Registra un nuevo usuario en Firebase Authentication.
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
    } catch (error: any) {
      // Traducir errores de Firebase a mensajes comprensibles
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
   * Inicia sesión con alias y contraseña en Firebase Authentication.
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
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential') {
        throw new Error('Alias o contraseña incorrectos.');
      }
      throw new Error('Error al iniciar sesión. Inténtalo de nuevo.');
    }
  }

  /**
   * Cierra la sesión del usuario actual en Firebase Authentication.
   */
  async logout(): Promise<void> {
    await signOut(auth);
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