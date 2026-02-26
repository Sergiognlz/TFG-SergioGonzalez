import { ILoginUser } from '../../interfaces/usecases/auth/ILoginUser';
import { IAuthRepository } from '../../interfaces/repositories/IAuthRepository';

/**
 * Caso de uso: Iniciar sesión con alias y contraseña.
 * Responsabilidad única (SOLID - S): solo gestiona el login.
 * Implementa ILoginUser siguiendo el principio de
 * Inversión de Dependencias (SOLID - D).
 */
export class LoginUser implements ILoginUser {
  /**
   * @param authRepository Implementación inyectada del repositorio de autenticación.
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Ejecuta el caso de uso: valida las credenciales e inicia sesión.
   * @param alias Alias del jugador.
   * @param password Contraseña del jugador.
   * @throws Error si las credenciales son incorrectas.
   */
  async execute(alias: string, password: string): Promise<void> {
    if (alias.trim().length < 3) {
      throw new Error('El alias debe tener al menos 3 caracteres.');
    }
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
    await this.authRepository.login(alias, password);
  }
}