import { SaveSessionScore } from '../domain/usecases/SaveSessionScore';
import { IRankingRepository } from '../domain/interfaces/repositories/IRankingRepository';

// Mock del repositorio de ranking.
const mockRankingRepository: jest.Mocked<IRankingRepository> = {
  updateScore: jest.fn(),
  getRanking: jest.fn(),
  savePlayer: jest.fn(),
  aliasExists: jest.fn(),
};

const saveSessionScore = new SaveSessionScore(mockRankingRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

// ─────────────────────────────────────────────
// UT-12: SaveSessionScore llama a updateScore cuando score > 0
// ─────────────────────────────────────────────
test('UT-12: execute llama a updateScore cuando la puntuación es mayor que 0', async () => {
  mockRankingRepository.updateScore.mockResolvedValue(undefined);

  await saveSessionScore.execute('jugador1', 300);

  // Debe haberse llamado con el alias y la puntuación correctos.
  expect(mockRankingRepository.updateScore).toHaveBeenCalledTimes(1);
  expect(mockRankingRepository.updateScore).toHaveBeenCalledWith('jugador1', 300);
});

// ─────────────────────────────────────────────
// UT-13: SaveSessionScore NO llama a updateScore cuando score = 0
// ─────────────────────────────────────────────
test('UT-13: execute no llama a updateScore cuando la puntuación es 0', async () => {
  await saveSessionScore.execute('jugador1', 0);

  // No debe persistirse nada si la puntuación es 0.
  expect(mockRankingRepository.updateScore).not.toHaveBeenCalled();
});