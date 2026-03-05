import { SubmitAnswer } from '../domain/usecases/SubmitAnswer';
import { IMovieRepository } from '../domain/interfaces/repositories/IMovieRepository';

// Mock del repositorio de películas.
// No llamamos a TMDB de verdad: jest.fn() crea funciones falsas controladas.
const mockMovieRepository: jest.Mocked<IMovieRepository> = {
  getRandomMovie: jest.fn(),
  searchMovies: jest.fn(),
};

// Metadatos de película de prueba reutilizados en todos los tests.
const fakeMovieMeta = {
  year: 1994,
  director: 'Frank Darabont',
  genre: 'Drama',
  cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton', 'William Sadler'],
};

// Instancia del caso de uso con el repositorio falso inyectado.
const submitAnswer = new SubmitAnswer(mockMovieRepository);

// ─────────────────────────────────────────────
// UT-01: Respuesta correcta con 5 intentos restantes → score 500, win
// ─────────────────────────────────────────────
test('UT-01: respuesta correcta con 5 intentos devuelve score 500 y gameResult win', async () => {
  const result = await submitAnswer.execute(
    42,           // selectedMovieId  (el jugador elige la película correcta)
    42,           // activeMovieId    (la película activa es la misma)
    5,            // attemptsLeft     (primer intento, quedan 5)
    'jugador1',
    fakeMovieMeta,
  );

  expect(result.isCorrect).toBe(true);
  expect(result.gameResult).toBe('win');
  expect(result.score).toBe(500);   // 5 intentos × 100
  expect(result.hint).toBeNull();
});

// ─────────────────────────────────────────────
// UT-02: Respuesta correcta con 3 intentos restantes → score 300, win
// ─────────────────────────────────────────────
test('UT-02: respuesta correcta con 3 intentos devuelve score 300 y gameResult win', async () => {
  const result = await submitAnswer.execute(42, 42, 3, 'jugador1', fakeMovieMeta);

  expect(result.isCorrect).toBe(true);
  expect(result.gameResult).toBe('win');
  expect(result.score).toBe(300);   // 3 intentos × 100
  expect(result.hint).toBeNull();
});

// ─────────────────────────────────────────────
// UT-03: Respuesta incorrecta con 5 intentos → pista año, playing
// ─────────────────────────────────────────────
test('UT-03: respuesta incorrecta con 5 intentos devuelve pista de año y gameResult playing', async () => {
  const result = await submitAnswer.execute(
    99,   // selecciona película incorrecta
    42,
    5,
    'jugador1',
    fakeMovieMeta,
  );

  expect(result.isCorrect).toBe(false);
  expect(result.gameResult).toBe('playing');
  expect(result.score).toBe(0);
  expect(result.hint).toBe('Año: 1994');   // primer fallo → pista año
});

// ─────────────────────────────────────────────
// UT-04: Respuesta incorrecta con 4 intentos → pista director, playing
// ─────────────────────────────────────────────
test('UT-04: respuesta incorrecta con 4 intentos devuelve pista de director y gameResult playing', async () => {
  const result = await submitAnswer.execute(99, 42, 4, 'jugador1', fakeMovieMeta);

  expect(result.isCorrect).toBe(false);
  expect(result.gameResult).toBe('playing');
  expect(result.hint).toBe('Director: Frank Darabont');
});

// ─────────────────────────────────────────────
// UT-05: Respuesta incorrecta con 3 intentos → pista género, playing
// ─────────────────────────────────────────────
test('UT-05: respuesta incorrecta con 3 intentos devuelve pista de género y gameResult playing', async () => {
  const result = await submitAnswer.execute(99, 42, 3, 'jugador1', fakeMovieMeta);

  expect(result.isCorrect).toBe(false);
  expect(result.gameResult).toBe('playing');
  expect(result.hint).toBe('Género: Drama');
});

// ─────────────────────────────────────────────
// UT-06: Respuesta incorrecta con 2 intentos → pista reparto, playing
// ─────────────────────────────────────────────
test('UT-06: respuesta incorrecta con 2 intentos devuelve pista de reparto y gameResult playing', async () => {
  const result = await submitAnswer.execute(99, 42, 2, 'jugador1', fakeMovieMeta);

  expect(result.isCorrect).toBe(false);
  expect(result.gameResult).toBe('playing');
  expect(result.hint).toBe('Reparto: Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler');
});

// ─────────────────────────────────────────────
// UT-07: Respuesta incorrecta con 1 intento → game over (loss), sin pista
// ─────────────────────────────────────────────
test('UT-07: respuesta incorrecta con 1 intento devuelve gameResult loss y sin pista', async () => {
  const result = await submitAnswer.execute(99, 42, 1, 'jugador1', fakeMovieMeta);

  expect(result.isCorrect).toBe(false);
  expect(result.gameResult).toBe('loss');
  expect(result.score).toBe(0);
  expect(result.hint).toBeNull();
});

// ─────────────────────────────────────────────
// UT-08: Jugador pasa (selectedMovieId = -1) con 5 intentos → pista año, playing
// ─────────────────────────────────────────────
test('UT-08: pasar con 5 intentos devuelve pista de año y gameResult playing', async () => {
  const result = await submitAnswer.execute(-1, 42, 5, 'jugador1', fakeMovieMeta);

  expect(result.isCorrect).toBe(false);
  expect(result.gameResult).toBe('playing');
  expect(result.score).toBe(0);
  expect(result.hint).toBe('Año: 1994');
});

// ─────────────────────────────────────────────
// UT-09: Jugador pasa (selectedMovieId = -1) con 1 intento → game over (loss)
// ─────────────────────────────────────────────
test('UT-09: pasar con 1 intento devuelve gameResult loss', async () => {
  const result = await submitAnswer.execute(-1, 42, 1, 'jugador1', fakeMovieMeta);

  expect(result.isCorrect).toBe(false);
  expect(result.gameResult).toBe('loss');
  expect(result.hint).toBeNull();
});