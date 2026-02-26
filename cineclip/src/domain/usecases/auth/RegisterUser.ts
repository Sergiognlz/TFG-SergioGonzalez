import { IRegisterUser } from '../../interfaces/usecases/auth/IRegisterUser';
import { IAuthRepository } from '../../interfaces/repositories/IAuthRepository';
import { IRankingRepository } from '../../interfaces/repositories/IRankingRepository';
import { Player } from '../../entities/Player';

/**
 * Caso de uso: Registrar un nuevo usuario con alias y contraseña.
 * Responsabilidad única (SOLID - S): gestiona el registro en Firebase Auth
 * y la creación del perfil del jugador en Firestore.
 * Implementa IRegisterUser siguiendo el principio de
 * Inversión de Dependencias (SOLID - D).
 */
export class RegisterUser implements IRegisterUser {
  /**
   * @param authRepository Repositorio de autenticación.
   * @param rankingRepository Repositorio para crear el perfil del jugador.
   */
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly rankingRepository: IRankingRepository,
  ) {}

  /**
   * Ejecuta el caso de uso: valida los datos, registra en Firebase Auth
   * y crea el perfil del jugador en Firestore.
   * @param alias Alias elegido por el jugador (3-20 caracteres).
   * @param password Contraseña elegida (mínimo 6 caracteres).
   * @throws Error si los datos no son válidos o el alias ya existe.
   */
  async execute(alias: string, password: string): Promise<void> {
    // Validar alias
    if (alias.trim().length < 3) {
      throw new Error('El alias debe tener al menos 3 caracteres.');
    }
    if (alias.trim().length > 20) {
      throw new Error('El alias no puede superar los 20 caracteres.');
    }
    // Validar que el alias no contenga espacios
    if (/\s/.test(alias)) {
        throw new Error('El alias no puede contener espacios.');
    }

    // Validar contraseña
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    // Registrar en Firebase Authentication
    await this.authRepository.register(alias, password);

    // Crear perfil del jugador en Firestore
    const player: Player = {
      alias: alias.trim(),
      totalScore: 0,
      gamesPlayed: 0,
      registeredAt: new Date(),
      lastGameAt: null,
    };

    await this.rankingRepository.savePlayer(player);
  }
}