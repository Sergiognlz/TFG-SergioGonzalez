import { Player } from '../entities/Player';
import { RankingRepository } from '../repositories/RankingRepository';

/**
 * Caso de uso: Registrar un nuevo jugador.
 * Responsabilidad única (SOLID - S): valida el alias y crea
 * el perfil del jugador en la base de datos si no existe ya.
 */
export class RegisterPlayer {
  /**
   * @param rankingRepository Repositorio para verificar y guardar el jugador.
   */
  constructor(private readonly rankingRepository: RankingRepository) {}

  /**
   * Ejecuta el caso de uso: valida el alias y registra al jugador.
   * @param alias Alias elegido por el jugador (3-20 caracteres).
   * @returns Promise con el Player creado.
   * @throws Error si el alias no cumple las validaciones o ya está en uso.
   */
  async execute(alias: string): Promise<Player> {
    // Validar longitud del alias
    if (alias.trim().length < 3) {
      throw new Error('El alias debe tener al menos 3 caracteres.');
    }
    if (alias.trim().length > 20) {
      throw new Error('El alias no puede superar los 20 caracteres.');
    }

    // Comprobar si el alias ya está registrado
    const exists = await this.rankingRepository.aliasExists(alias);
    if (exists) {
      throw new Error('Este alias ya está en uso. Elige otro.');
    }

    // Crear el nuevo jugador
    const player: Player = {
      alias: alias.trim(),
      totalScore: 0,
      gamesPlayed: 0,
      registeredAt: new Date(),
      lastGameAt: null,
    };

    await this.rankingRepository.savePlayer(player);
    return player;
  }
}