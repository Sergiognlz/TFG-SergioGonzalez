import { StartGame } from '../domain/usecases/StartGame';
import { IMovieRepository } from '../domain/interfaces/repositories/IMovieRepository';
import { Movie } from '../domain/entities/Movie';

// Mock del repositorio de películas.
const mockMovieRepository: jest.Mocked<IMovieRepository> = {
  getRandomMovie: jest.fn(),
  searchMovies: jest.fn(),
};

// Película falsa que el mock devolverá.
const fakeMovie: Movie = {
  id: 278,
  title: 'Cadena perpetua',
  originalTitle: 'The Shawshank Redemption',
  year: 1994,
  genre: 'Drama',
  director: 'Frank Darabont',
  cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton', 'William Sadler'],
  backdrops: ['/backdrop1.jpg', '/backdrop2.jpg'],
};

const startGame = new StartGame(mockMovieRepository);

// Resetear el mock antes de cada test para que no haya interferencias entre ellos.
beforeEach(() => {
  jest.clearAllMocks();
});

// ─────────────────────────────────────────────
// UT-10: StartGame devuelve la película que entrega el repositorio
// ─────────────────────────────────────────────
test('UT-10: execute devuelve la película obtenida del repositorio', async () => {
  // Configuramos el mock para que devuelva nuestra película falsa.
  mockMovieRepository.getRandomMovie.mockResolvedValue(fakeMovie);

  const result = await startGame.execute();

  expect(result).toEqual(fakeMovie);
});

// ─────────────────────────────────────────────
// UT-11: StartGame llama exactamente una vez a getRandomMovie
// ─────────────────────────────────────────────
test('UT-11: execute llama a getRandomMovie exactamente una vez', async () => {
  mockMovieRepository.getRandomMovie.mockResolvedValue(fakeMovie);

  await startGame.execute();

  // Verificamos que el repositorio fue invocado una sola vez.
  expect(mockMovieRepository.getRandomMovie).toHaveBeenCalledTimes(1);
});