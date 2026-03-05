import { GetRanking } from '../domain/usecases/GetRanking';
import { IRankingRepository } from '../domain/interfaces/repositories/IRankingRepository';
import { Score } from '../domain/entities/Score';

// Mock del repositorio de ranking.
const mockRankingRepository: jest.Mocked<IRankingRepository> = {
  updateScore: jest.fn(),
  getRanking: jest.fn(),
  savePlayer: jest.fn(),
  aliasExists: jest.fn(),
};

// Lista falsa de puntuaciones que devolverá el mock.
const fakeRanking: Score[] = [
  { alias: 'jugador1', maxScore: 1500, updatedAt: new Date('2024-01-01') },
  { alias: 'jugador2', maxScore: 1200, updatedAt: new Date('2024-01-02') },
  { alias: 'jugador3', maxScore: 900,  updatedAt: new Date('2024-01-03') },
];

const getRanking = new GetRanking(mockRankingRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

// ─────────────────────────────────────────────
// UT-14: GetRanking devuelve la lista que entrega el repositorio
// ─────────────────────────────────────────────
test('UT-14: execute devuelve la lista de puntuaciones del repositorio', async () => {
  mockRankingRepository.getRanking.mockResolvedValue(fakeRanking);

  const result = await getRanking.execute();

  expect(result).toEqual(fakeRanking);
  expect(result).toHaveLength(3);
});

// ─────────────────────────────────────────────
// UT-15: GetRanking pasa el límite correcto al repositorio
// ─────────────────────────────────────────────
test('UT-15: execute pasa el límite indicado al repositorio', async () => {
  mockRankingRepository.getRanking.mockResolvedValue(fakeRanking.slice(0, 2));

  await getRanking.execute(2);

  // El repositorio debe recibir exactamente el límite que pedimos.
  expect(mockRankingRepository.getRanking).toHaveBeenCalledWith(2);
});