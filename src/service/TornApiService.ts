export class TornApiService {
    private baseUrl: string


    constructor() {
        this.baseUrl = "https://api.torn.com";
    }

    public async getUser(userId: string, key: string) {
        return this._fetchFromTorn(`user/${userId}?selections=basic`, key);
    }

    public async getUserStats(userId: string, key: string) {
        return this._fetchFromTorn(`user/${userId}?selections=battlestats`, key);
    }

    public async checkHospital(userId: string, key: string) {
        const userData = await this.getUser(userId, key);
        return userData?.status?.state === "Hospital";
    }

    private async _fetchFromTorn(endpoint: string, key: string) {
        const url = `${this.baseUrl}/${endpoint}&key=${key}`;
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