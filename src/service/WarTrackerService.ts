import {
	WarMember,
	FactionMember,
	MemberWithId,
	UserStatus,
	Status,
	Location,
	Locations,
} from "../Types/index.js";
import {
	ITornApiService,
	IApiKeyRepository,
	IWarTrackerRepository,
} from "../Types/interfaces.js";

export class WarTracker {
	private repository: IWarTrackerRepository;
	private apiKeyRepository: IApiKeyRepository;
	private tornApiService: ITornApiService;
	private askeLadds: string = "41309";
	private factionId?: string;
	private retries: number = 0;

	constructor(
		repository: IWarTrackerRepository,
		apiKeyRepository: IApiKeyRepository,
		tornApiService: ITornApiService
	) {
		this.repository = repository;
		this.apiKeyRepository = apiKeyRepository;
		this.tornApiService = tornApiService;
	}

	public async track(): Promise<void> {
		try {
			await this.handleTracking();
		} catch (err: any) {
			console.log("Tracking failed");
			console.log(err);
		}
	}

	private async handleTracking(): Promise<void> {
		if (!this.factionId) {
			return;
		}

		const key = await this.apiKeyRepository.getRandomKey();
		const faction = await this.tornApiService.getFaction(this.factionId, key);
		if (!faction) {
			return;
		}
		const members = this.mapTornData(faction.members);

		let storedMembers;
		try {
			storedMembers = await this.getStoredData();
		} catch (error) {
			return;
		}

		const data: WarMember[] = members.map((member: MemberWithId) => {
			const current: WarMember | undefined = storedMembers.find(
				(x: WarMember) => x.member_id == member.id
			);
			const location = this.getLocation(
				member.status.description,
				member.status.state,
				current?.location
			);

			return {
				member_id: member.id,
				member_name: member.name,
				level: member.level,
				faction_id: this.factionId,
				activity: member.last_action.status,
				status: {
					userStatus: member.status.state,
					untill: member.status.until || undefined,
				},
				location:
					current?.location.current === location.current &&
					member.status.state === current.status.userStatus
						? current?.location
						: location,
			} as WarMember;
		});

		for (const item of data) {
			if (storedMembers.length > 0) {
				await this.repository.updateFactionData(item);
			} else {
				await this.repository.insert(item);
			}
		}
	}

	public async getEnemy(): Promise<void> {
		const key = await this.apiKeyRepository.getRandomKey();
		const faction = await this.tornApiService.getFaction(this.askeLadds, key);

		if (!faction) {
			console.log("could not get faction from torn, in getEnemy");
			return;
		}

		const warId = Object.keys(faction.ranked_wars)[0];
		const war = faction.ranked_wars[warId];

		if (!war) {
			if (this.factionId) {
				await this.repository.deleteFactionData(this.factionId);
			}

			this.factionId = this.askeLadds;
			return;
		}

		const factionIds = Object.keys(war.factions);
		const opponentId = factionIds.find((id) => id !== this.askeLadds);

		if (this.factionId !== opponentId) {
			if (this.factionId) {
				await this.repository.deleteFactionData(this.factionId);
			}
		}
		this.factionId = opponentId!;
	}

	private getLocation(
		description: string,
		state: string,
		current?: Location
	): Location {
		let location: Location = {} as Location;

		if (state !== UserStatus.traveling) {
			location.current =
				Object.values(Locations).find((x) => description.includes(x)) ||
				Locations.torn;
			return location;
		}
		const temp = description.split(Locations.torn);

		if (temp.length > 1) {
			location.destination = Locations.torn;
			location.current = Object.values(Locations).find((x) =>
				temp[1].includes(x)
			)!;
		} else {
			location.current = Locations.torn;
			location.destination = Object.values(Locations).find((x) =>
				description.includes(x)
			)!;
		}

		let now = Date.now();
		if (now > 20000000000) {
			now = now / 1000;
		}

		if (
			current?.current !== location.current ||
			current?.destination !== location.destination
		) {
			location.initiated = now;
		}

		return location;
	}

	private async getStoredData(): Promise<any> {
		try {
			return this.repository.getFactionData(this.factionId!);
		} catch (error) {
			console.log("Failed to fetch faction data:", error);
			throw error;
		}
	}

	private mapTornData(
		factionData: Record<string, FactionMember>
	): MemberWithId[] {
		return Object.entries(factionData).map(([id, member]) => ({
			id: parseInt(id),
			...member,
		}));
	}

	public getFactionId() {
		return this.factionId;
	}
}
