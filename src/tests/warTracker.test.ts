import { describe, it, expect, vi, beforeEach } from "vitest";
import { WarTracker } from "../service/WarTrackerService.js";
import {
	ITornApiService,
	IApiKeyRepository,
	IWarTrackerRepository,
} from "../Types/interfaces.js";
import { WarMember, UserStatus, Locations } from "../Types/index.js";
import {
	expectedResult,
	tornApiResponse,
	askeladds,
	notAtWar,
	dataToBeStored,
	oldStoredData,
	originalStatus,
	newStatus,
} from "./TestData.js";

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

describe("WarTracker", () => {
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

	describe("track", () => {
		it("Insert data without existing data", async () => {
			mockApiKeyRepository.getRandomKey.mockResolvedValue("test-api-key");
			mockWarTrackerRepository.getFactionData.mockResolvedValue([]);
			mockTornApiService.getFaction
				.mockResolvedValueOnce(askeladds)
				.mockResolvedValueOnce(tornApiResponse);

			const insertCalls: any = [];
			mockWarTrackerRepository.insert.mockImplementation((data) => {
				insertCalls.push(data);
				return Promise.resolve();
			});

			await warTracker.getEnemy();
			await warTracker.track();

			expect(insertCalls).toEqual(expectedResult);
			expect(mockTornApiService.getFaction).toHaveBeenCalledTimes(2);
		});

		it("New flight data should not be added if data is already in db", async () => {
			mockApiKeyRepository.getRandomKey.mockResolvedValue("test-api-key");
			mockWarTrackerRepository.getFactionData.mockResolvedValue([]);
			mockTornApiService.getFaction
				.mockResolvedValueOnce(askeladds)
				.mockResolvedValueOnce(tornApiResponse);

			const insertCalls: any = [];
			mockWarTrackerRepository.insert.mockImplementation((data) => {
				insertCalls.push(data);
				return Promise.resolve();
			});

			await warTracker.getEnemy();
			await warTracker.track();

			vi.setSystemTime(new Date(1743622224));
			await warTracker.track();

			expect(insertCalls).toEqual(expectedResult);
			expect(mockTornApiService.getFaction).toHaveBeenCalledTimes(3);
		});

		it("One user changes their status", async () => {
			mockApiKeyRepository.getRandomKey.mockResolvedValue("test-api-key");
			mockWarTrackerRepository.getFactionData.mockResolvedValue(oldStoredData);
			mockTornApiService.getFaction
				.mockResolvedValueOnce(askeladds)
				.mockResolvedValueOnce(newStatus);

			const insertCalls: any = [];
			mockWarTrackerRepository.updateFactionData.mockImplementation((data) => {
				insertCalls.push(data);
				return Promise.resolve();
			});

			await warTracker.getEnemy();
			await warTracker.track();

			vi.setSystemTime(new Date(1743622224));
			await warTracker.track();

			expect(insertCalls).toEqual(dataToBeStored);
			expect(mockTornApiService.getFaction).toHaveBeenCalledTimes(3);
		});

		it("Faction is at war", async () => {
			mockApiKeyRepository.getRandomKey.mockResolvedValue("test-api-key");
			mockTornApiService.getFaction.mockResolvedValueOnce(askeladds);

			await warTracker.getEnemy();
			const factionId = warTracker.getFactionId();
			expect(factionId).toEqual("42133");
		});

		it("Faction is NOT at war", async () => {
			mockApiKeyRepository.getRandomKey.mockResolvedValue("test-api-key");
			mockTornApiService.getFaction.mockResolvedValueOnce(notAtWar);

			await warTracker.getEnemy();
			const factionId = warTracker.getFactionId();
			expect(factionId).toEqual("41309");
		});

		it("Api call fails", async () => {
			mockApiKeyRepository.getRandomKey.mockResolvedValueOnce("test-api-key");
			mockTornApiService.getFaction.mockResolvedValueOnce(notAtWar);

			await warTracker.getEnemy();
			await warTracker.getEnemy();

			const factionId = warTracker.getFactionId();
			expect(factionId).toEqual("41309");
		});
	});
});
