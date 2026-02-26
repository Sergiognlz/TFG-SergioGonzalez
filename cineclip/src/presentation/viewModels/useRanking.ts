import { useState, useCallback } from 'react';
import { Score } from '../../domain/entities/Score';
import { getRanking } from '../../di/container';

/**
 * Hook que gestiona la obtención y refresco del ranking global.
 * Actúa como ViewModel de RankingView.
 */
export function useRanking() {

  /** Lista de puntuaciones del ranking global. */
  const [ranking, setRanking] = useState<Score[]>([]);

  /** Indica si se está cargando el ranking. */
  const [loading, setLoading] = useState(false);

  /** Mensaje de error si la carga falla. */
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga el ranking global desde Firebase.
   * @param limit Número máximo de entradas a mostrar. Por defecto 10.
   */
  const loadRanking = useCallback(async (limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      const scores = await getRanking.execute(limit);
      setRanking(scores);
    } catch (e) {
      setError('No se pudo cargar el ranking. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ranking,
    loading,
    error,
    loadRanking,
  };
}