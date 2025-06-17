import { response } from "express";
import {
	WarMember,
	FactionMember,
	MemberWithId,
	UserStatus,
	Status,
	Location,
	Locations,
	HospitalAbroad,
	Combatstats,
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
	private alliedFaction: string = process.env.ALLIED_FACTION!;
	private factionId?: string;
	private retries: number = 0;
	private updateBsp: boolean = false;

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
			await this.handleTracking(this.factionId);
			await this.handleTracking(this.alliedFaction);
		} catch (err: any) {
			console.log("Tracking failed");
			console.log(err);
		}
	}

	private async handleTracking(factionId?: string): Promise<void> {
		if (!factionId) {
			return;
		}

		const key = await this.apiKeyRepository.getRandomKey();
		const faction = await this.tornApiService.getFactionMembers(factionId, key);
		if (!faction) {
			return;
		}
		const members = this.mapTornData(faction.members);

		let storedMembers;
		try {
			storedMembers = await this.getStoredData(factionId);
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
				faction_id: factionId,
				activity: member.last_action.status,
				status: {
					userStatus: member.status.state,
					untill: member.status.until * 1000 || undefined,
				},
				location:
					current?.location.current === location.current &&
					member.status.state === current.status.userStatus
						? current?.location
						: location,
			} as WarMember;
		});

		for (const item of data) {
			const current: WarMember | undefined = storedMembers.find(
				(x: WarMember) => {
					return x.member_id.toString() == item.member_id.toString();
				}
			);

			if (current && this.isEqual(item, current)) {
				continue;
			}

			if (current) {
				if (this.updateBsp) {
					const bsp = await this.getBsp(item);

					if (bsp.bsp !== current.bsp) {
						item.bsp = bsp.bsp;
						item.defence = bsp.defence;
						item.strength = bsp.strength;
						item.dexterity = bsp.dexterity;
						item.speed = bsp.speed;
					}
				}

				if (current.location.destination !== item.location.destination) {
					item.alerted = false;
				}

				await this.repository.updateFactionData(item);
			} else {
				const data = item;
				const bsp = await this.getBsp(item);
				const apiKey = await this.apiKeyRepository.getRandomKey();

				if (item.faction_id === this.alliedFaction) {
					const discordReponse = await this.tornApiService.getDiscordId(
						item.member_id,
						apiKey
					);

					data.discord_id = discordReponse.discord.discordID;
				}

				data.bsp = bsp.bsp;
				data.strength = bsp.strength;
				data.speed = bsp.speed;
				data.defence = bsp.defence;
				data.dexterity = bsp.dexterity;

				await this.repository.insert(data);
			}
		}
		if (this.updateBsp) {
			this.updateBsp = false;
		}
	}

	public async getBsp(item: WarMember) {
		const stats = {} as Combatstats;

		const response = await fetch(
			`http://www.lol-manager.com/api/battlestats/y7VF6FWBRE1QHQ5X/${item.member_id}/9.3.2`
		);
		const bspResult = await response.json();

		const tornStats: any = await this.getTornstatsData(item.faction_id);
		const user = tornStats?.faction?.members[item.member_id].spy;

		const spyDate = user?.timestamp * 1000;
		const timeToCheck = new Date().getTime() - 604800000;

		if (spyDate > timeToCheck) {
			stats.bsp = user.total;
			stats.strength = user.strength;
			stats.defence = user.defense;
			stats.speed = user.speed;
			stats.dexterity = user.dexterity;

			return stats;
		}

		stats.bsp = bspResult.TBS_Raw;

		return stats;
	}

	public toggleUpdateBsp() {
		this.updateBsp = true;
	}

	public async getTornstatsData(factionId: string) {
		const tornStatsToken = process.env.TORNSTATS_TOKEN;
		const response = await fetch(
			`https://www.tornstats.com/api/v2/${tornStatsToken}/spy/faction/${factionId}`
		);
		const result = await response.json();
		return result;
	}

	public async getEnemy(): Promise<void> {
		const key = await this.apiKeyRepository.getRandomKey();
		const faction = await this.tornApiService.getFaction(
			this.alliedFaction,
			key
		);

		if (!faction) {
			console.log("could not get faction from torn, in getEnemy");
			return;
		}

		const warId = Object.keys(faction.ranked_wars)[0];
		const war = faction.ranked_wars[warId];

		if (!war || !!war.war?.end) {
			if (this.factionId) {
				await this.repository.deleteFactionData(this.factionId);
			}
			return (this.factionId = undefined);
		}

		const factionIds = Object.keys(war.factions);
		const opponentId = factionIds.find((id) => id !== this.alliedFaction);

		if (this.factionId !== opponentId) {
			if (this.factionId) {
				await this.repository.deleteFactionData(this.factionId);
			}
		}
		console.log("setting opponent: ", opponentId);
		this.factionId = opponentId!;
	}

	private getCountryFromHospitalMessage = (description: String) => {
		const country = Object.values(HospitalAbroad).find((x) =>
			description.includes(x)
		);

		switch (country) {
			case HospitalAbroad.argentinian:
				return Locations.argentina;
			case HospitalAbroad.british:
				return Locations.england;
			case HospitalAbroad.caymanian:
				return Locations.cayman_islands;
			case HospitalAbroad.chineese:
				return Locations.china;
			case HospitalAbroad.canadian:
				return Locations.canada;
			case HospitalAbroad.hawaiian:
				return Locations.hawaii;
			case HospitalAbroad.japanese:
				return Locations.japan;
			case HospitalAbroad.emirati:
				return Locations.dubai;
			case HospitalAbroad.mexican:
				return Locations.mexico;
			case HospitalAbroad.south_african:
				return Locations.south_africa;
			case HospitalAbroad.swiss:
				return Locations.switzerland;
			default:
				return Locations.torn;
		}
	};

	private getLocation(
		description: string,
		state: string,
		current?: Location
	): Location {
		let location: Location = {} as Location;

		if (state !== UserStatus.traveling) {
			if (Object.values(HospitalAbroad).find((x) => description.includes(x))) {
				location.current = this.getCountryFromHospitalMessage(description);
			} else {
				location.current =
					Object.values(Locations).find((x) => description.includes(x)) ||
					Locations.torn;
			}

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

		if (
			current?.current !== location.current ||
			current?.destination !== location.destination
		) {
			location.initiated = Date.now();
		}

		return location;
	}

	private async getStoredData(factionId: string): Promise<any> {
		try {
			return this.repository.getFactionData(factionId);
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

	private isEqual(a: WarMember, b: WarMember) {
		return (
			a.activity === b.activity &&
			a.destination === b.destination &&
			a.level === b.level &&
			a.location.current === b.location.current &&
			a.location.destination === b.location.destination &&
			a.location.initiated === b.location.initiated &&
			a.status.userStatus == b.status.userStatus &&
			a.status.untill == b.status.untill &&
			a.bsp === b.bsp
		);
	}

	public getFactionId() {
		return this.factionId;
	}
}
