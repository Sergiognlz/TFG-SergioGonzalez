import { useState, useCallback, useRef } from 'react';
import { Game } from '../../domain/entities/Game';
import { Movie } from '../../domain/entities/Movie';
import { startGame, submitAnswer, saveSessionScore } from '../../di/container';

/**
 * Hook principal de la aplicación. Actúa como ViewModel de GameView.
 * Gestiona la mecánica de racha: el jugador acumula puntuación
 * mientras acierta películas. Un fallo termina la sesión.
 *
 * El estado de la partida y la puntuación se reciben desde fuera
 * para que sobrevivan a los cambios de pantalla (ranking, etc.).
 */
export function useGame(
  alias: string,
  initialGame: Game | null,
  initialSessionScore: number,
  onGameStateChange: (game: Game | null, sessionScore: number) => void,
) {
  /** Estado completo de la partida activa. */
  const [game, setGame] = useState<Game | null>(initialGame);

  /** Puntuación acumulada en la sesión actual. */
  const [sessionScore, setSessionScore] = useState(initialSessionScore);

  /** Ref para tener siempre el sessionScore más reciente en los callbacks. */
  const sessionScoreRef = useRef(initialSessionScore);

  /** Indica si se está cargando una nueva película. */
  const [loading, setLoading] = useState(false);

  /** Mensaje de error. Null si no hay error. */
  const [error, setError] = useState<string | null>(null);

  /**
   * Actualiza el estado y notifica a App.tsx para que lo persista.
   */
  const updateState = useCallback((newGame: Game | null, newScore: number) => {
    setGame(newGame);
    setSessionScore(newScore);
    sessionScoreRef.current = newScore;
    onGameStateChange(newGame, newScore);
  }, [onGameStateChange]);

  /**
   * Carga una nueva película y construye el estado inicial del juego.
   * Usa sessionScoreRef para tener siempre el valor más reciente.
   */
  const initGame = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const movie: Movie = await startGame.execute();
      const newGame: Game = {
        movie,
        attemptsLeft: 5,
        currentBackdropIndex: 0,
        hintsRevealed: [],
        result: 'playing',
        score: 0,
      };
      updateState(newGame, sessionScoreRef.current);
    } catch (e) {
      setError('No se pudo cargar la película. Comprueba tu conexión.');
    } finally {
      setLoading(false);
    }
  }, [updateState]);

  /**
   * Procesa la respuesta del jugador.
   * - Acierto: acumula puntuación en el ref y carga nueva película.
   * - Fallo con intentos: muestra nuevo backdrop y pista.
   * - Game over: guarda puntuación total en el ranking.
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
        // Acumular puntuación usando el ref para evitar closures obsoletos
        const newSessionScore = sessionScoreRef.current + result.score;
        sessionScoreRef.current = newSessionScore;
        setSessionScore(newSessionScore);
        onGameStateChange(null, newSessionScore);
        await initGame();

      } else if (result.gameResult === 'loss') {
        // Game over: guardar puntuación total en el ranking
        const finalScore = sessionScoreRef.current;
        await saveSessionScore.execute(alias, finalScore);
        const lostGame = { ...game, result: 'loss' as const, score: finalScore };
        updateState(lostGame, finalScore);

      } else {
        // Fallo con intentos restantes: actualizar backdrop y pistas
        const nextBackdropIndex = Math.min(
          game.currentBackdropIndex + 1,
          game.movie.backdrops.length - 1,
        );
        const newHints = result.hint
          ? [...game.hintsRevealed, result.hint]
          : game.hintsRevealed;

        const updatedGame = {
          ...game,
          attemptsLeft: game.attemptsLeft - 1,
          currentBackdropIndex: nextBackdropIndex,
          hintsRevealed: newHints,
        };
        updateState(updatedGame, sessionScoreRef.current);
      }
    } catch (e) {
      setError('Error al procesar la respuesta. Inténtalo de nuevo.');
    }
  }, [game, alias, initGame, updateState, onGameStateChange]);

  return {
    game,
    sessionScore,
    loading,
    error,
    initGame,
    handleAnswer,
  };
}