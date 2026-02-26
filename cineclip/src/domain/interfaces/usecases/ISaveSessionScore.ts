/**
 * Interfaz del caso de uso: Guardar la puntuación total de la sesión.
 */
export interface ISaveSessionScore {
  execute(alias: string, totalScore: number): Promise<void>;
}