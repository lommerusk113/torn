import { FactionData } from "../Types/index.js";
import { ITornApiService } from "../Types/interfaces.js";
export class TornApiService implements ITornApiService {
	private baseUrl: string;

	constructor() {
		this.baseUrl = "https://api.torn.com";
	}

	public async getUser(
		userId: string,
		key: string,
		selection: string = "basic"
	) {
		return this._fetchFromTorn(`user/${userId}?selections=${selection}`, key);
	}

	public async getDiscordId(userId: number, key: string) {
		return await this._fetchFromTorn(`user/${userId}?selections=discord`, key);
	}

	public async getUserStats(userId: string, key: string) {
		return this._fetchFromTorn(`user/${userId}?selections=battlestats`, key);
	}

	public async getFaction(
		factionId: string,
		apiKey: string
	): Promise<FactionData> {
		return this._fetchFromTorn(`faction/${factionId}?selections=basic`, apiKey);
	}

	public async getFactionMembers(
		factionId: string,
		apiKey: string
	): Promise<FactionData> {
		return this._fetchFromTorn(
			`v2/faction/${factionId}?selections=members`,
			apiKey
		);
	}

	public async checkHospital(
		userId: string,
		key: string
	): Promise<number | null> {
		const userData = await this.getUser(userId, key);
		return userData?.status?.state === "Hospital"
			? userData.status.until
			: null;
	}

	private async _fetchFromTorn(endpoint: string, key: string) {
		const cacheBuster = Date.now();
		const url = `${this.baseUrl}/${endpoint}&key=${key}&timestamp=${cacheBuster}`;
		try {
			const response = await fetch(url, {
				headers: {
					"Cache-Control": "no-cache, no-store",
					Pragma: "no-cache",
				},
			});
			if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
			const data = await response.json();
			if (data.error) throw new Error(`Torn API Error: ${data.error.error}`);
			if (data.error && data.error.error === "Too many requests") {
				console.log(endpoint);
			}
			return data;
		} catch (error: any) {
			console.error("Error fetching data:", error.message);
			return null;
		}
	}
}
