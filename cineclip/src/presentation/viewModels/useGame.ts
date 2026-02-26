import { useState, useCallback } from 'react';
import { Game } from '../../domain/entities/Game';
import { Movie } from '../../domain/entities/Movie';
import { startGame, submitAnswer, saveSessionScore } from '../../di/container';

/**
 * Hook principal de la aplicación. Actúa como ViewModel de GameView.
 * Gestiona la mecánica de racha: el jugador acumula puntuación
 * mientras acierta películas. Un fallo termina la sesión y guarda
 * la puntuación total acumulada en el ranking.
 */
export function useGame(alias: string) {

  /** Estado completo de la partida activa. */
  const [game, setGame] = useState<Game | null>(null);

  /** Puntuación acumulada en la sesión actual. Se reinicia al hacer game over. */
  const [sessionScore, setSessionScore] = useState(0);

  /** Indica si se está cargando una nueva película. */
  const [loading, setLoading] = useState(false);

  /** Mensaje de error. Null si no hay error. */
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga una nueva película y construye el estado inicial del juego.
   * Se llama al iniciar la sesión y automáticamente tras cada acierto.
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
   * - Acierto: acumula puntuación y carga nueva película automáticamente.
   * - Fallo con intentos restantes: muestra nuevo backdrop y pista.
   * - Game over: guarda la puntuación TOTAL de la sesión en el ranking.
   * @param selectedMovieId ID de TMDB de la película seleccionada. -1 si pasa.
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

      if (result.isCorrect) {
        // Acierto: acumular puntuación y cargar nueva película
        const newSessionScore = sessionScore + result.score;
        setSessionScore(newSessionScore);
        await initGame();

      } else if (result.gameResult === 'loss') {
        // Game over: guardar puntuación total de la sesión en el ranking
        const finalScore = sessionScore;
        await saveSessionScore.execute(alias, finalScore);
        setGame(prev => prev ? { ...prev, result: 'loss', score: finalScore } : null);

      } else {
        // Fallo pero quedan intentos: mostrar nuevo backdrop y pista
        setGame(prev => {
          if (!prev) return null;

          const nextBackdropIndex = Math.min(
            prev.currentBackdropIndex + 1,
            prev.movie.backdrops.length - 1,
          );

          const newHints = result.hint
            ? [...prev.hintsRevealed, result.hint]
            : prev.hintsRevealed;

          return {
            ...prev,
            attemptsLeft: prev.attemptsLeft - 1,
            currentBackdropIndex: nextBackdropIndex,
            hintsRevealed: newHints,
          };
        });
      }
    } catch (e) {
      setError('Error al procesar la respuesta. Inténtalo de nuevo.');
    }
  }, [game, alias, sessionScore, initGame]);

  return {
    game,
    sessionScore,
    loading,
    error,
    initGame,
    handleAnswer,
  };
}