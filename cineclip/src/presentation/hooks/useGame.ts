import { useState, useCallback } from 'react';
import { Game, GameResult } from '../../domain/entities/Game';
import { Movie } from '../../domain/entities/Movie';
import { startGame, submitAnswer } from '../../di/container';

/**
 * Hook principal de la aplicación. Actúa como ViewModel de GameView.
 * Siguiendo el patrón MVVM, este hook gestiona todo el estado
 * de la partida y expone funciones a la vista sin que esta
 * tenga ninguna lógica de negocio.
 * 
 * La vista solo renderiza lo que este hook expone y llama
 * a las funciones que este hook proporciona.
 */
export function useGame(alias: string) {

  /** Estado completo de la partida activa. Null si no hay partida en curso. */
  const [game, setGame] = useState<Game | null>(null);

  /** Indica si se está cargando una nueva película al iniciar partida. */
  const [loading, setLoading] = useState(false);

  /** Mensaje de error a mostrar si algo falla. Null si no hay error. */
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicia una nueva partida: obtiene una película aleatoria de TMDB
   * y construye el estado inicial del juego.
   */
  const initGame = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const movie: Movie = await startGame.execute();

      setGame({
        movie,
        attemptsLeft: 5,
        currentBackdropIndex: 0,
        hintsRevealed: [],
        result: 'playing',
        score: 0,
      });
    } catch (e) {
      setError('No se pudo cargar la película. Comprueba tu conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Procesa la respuesta del jugador.
   * Valida si el ID de la película seleccionada coincide con la activa,
   * actualiza el estado del juego y desvela la pista si hay fallo.
   * @param selectedMovieId ID de TMDB de la película seleccionada por el jugador.
   */
  const handleAnswer = useCallback(async (selectedMovieId: number) => {
    if (!game || game.result !== 'playing') return;

    try {
      const result = await submitAnswer.execute(
        selectedMovieId,
        game.movie.id,
        game.attemptsLeft,
        alias,
        {
          year: game.movie.year,
          director: game.movie.director,
          genre: game.movie.genre,
          cast: game.movie.cast,
        },
      );

      setGame(prev => {
        if (!prev) return null;

        // Calcular el siguiente índice de backdrop
        const nextBackdropIndex = Math.min(
          prev.currentBackdropIndex + (result.isCorrect ? 0 : 1),
          prev.movie.backdrops.length - 1,
        );

        // Añadir la pista si hay una nueva
        const newHints = result.hint
          ? [...prev.hintsRevealed, result.hint]
          : prev.hintsRevealed;

        return {
          ...prev,
          attemptsLeft: prev.attemptsLeft - (result.isCorrect ? 0 : 1),
          currentBackdropIndex: nextBackdropIndex,
          hintsRevealed: newHints,
          result: result.gameResult,
          score: result.score,
        };
      });
    } catch (e) {
      setError('Error al procesar la respuesta. Inténtalo de nuevo.');
    }
  }, [game, alias]);

  return {
    game,
    loading,
    error,
    initGame,
    handleAnswer,
  };
}