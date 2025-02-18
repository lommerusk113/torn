export class TornApiService {
    private apiKey: string
    private baseUrl: string


    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.torn.com";
    }

    public async getUser(userId: string) {
        return this._fetchFromTorn(`user/${userId}?selections=basic`);
    }

    public async getUserStats(userId: string) {
        return this._fetchFromTorn(`user/${userId}?selections=battlestats`);
    }

    public async checkHospital(userId: string) {
        const userData = await this.getUser(userId);
        return userData?.status?.state === "Hospital";
    }

    private async _fetchFromTorn(endpoint: string) {
        const url = `${this.baseUrl}/${endpoint}&key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            if (data.error) throw new Error(`Torn API Error: ${data.error.error}`);
            return data;
        } catch (error: any) {
            console.error("Error fetching data:", error.message);
            return null;
        }
    }
}