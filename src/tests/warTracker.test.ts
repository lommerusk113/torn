import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WarTracker } from '../service/WarTrackerService.js';
import { ITornApiService, IApiKeyRepository, IWarTrackerRepository } from '../Types/interfaces.js';
import { WarMember, UserStatus, Locations } from "../Types/index.js";
import { expectedResult, tornApiResponse, askeladds } from "./TestData.js"



// Mock implementations
class MockTornApiService implements ITornApiService {
  getFaction = vi.fn();
}

class MockApiKeyRepository implements IApiKeyRepository {
  getRandomKey = vi.fn();
}

class MockWarTrackerRepository implements IWarTrackerRepository {
  getFactionData = vi.fn();
  updateFactionData = vi.fn();
  insert = vi.fn();
  deleteFactionData = vi.fn();
}

describe('WarTracker', () => {
  let warTracker: WarTracker;
  let mockTornApiService: MockTornApiService;
  let mockApiKeyRepository: MockApiKeyRepository;
  let mockWarTrackerRepository: MockWarTrackerRepository;
  let originalDateNow: () => number;

  beforeEach(() => {

    vi.useFakeTimers();
    vi.setSystemTime(new Date(1743116378540));

    // Create new instances for each test
    mockTornApiService = new MockTornApiService();
    mockApiKeyRepository = new MockApiKeyRepository();
    mockWarTrackerRepository = new MockWarTrackerRepository();

    // Reset mocks
    vi.clearAllMocks();

    // Create WarTracker with mocked dependencies
    warTracker = new WarTracker(
      mockWarTrackerRepository,
      mockApiKeyRepository,
      mockTornApiService
    );
  });

  describe('track', () => {
    it('Insert data without existing data', async () => {

      mockApiKeyRepository.getRandomKey.mockResolvedValue('test-api-key');
      mockWarTrackerRepository.getFactionData.mockResolvedValue([]);
      mockTornApiService.getFaction
        .mockResolvedValueOnce(askeladds)
        .mockResolvedValueOnce(tornApiResponse)

      const insertCalls: any = [];
      mockWarTrackerRepository.insert.mockImplementation(data => {
        insertCalls.push(data);
        return Promise.resolve();
      });

      await warTracker.getEnemy()
      await warTracker.track();

      expect(insertCalls).toEqual(expectedResult);
      expect(mockTornApiService.getFaction).toHaveBeenCalledTimes(2);
    });

    it('Faction is at war', async () => {

    });

    it('Faction is NOT at war', async () => {

    });
  });
});