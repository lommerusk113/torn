export class TornApiService {
    apiKey;
    baseUrl;
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.torn.com";
    }
    async getUser(userId) {
        return this._fetchFromTorn(`user/${userId}?selections=basic`);
    }
    async getUserStats(userId) {
        return this._fetchFromTorn(`user/${userId}?selections=battlestats`);
    }
    async checkHospital(userId) {
        const userData = await this.getUser(userId);
        return userData?.status?.state === "Hospital";
    }
    async _fetchFromTorn(endpoint) {
        const url = `${this.baseUrl}/${endpoint}&key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            if (data.error)
                throw new Error(`Torn API Error: ${data.error.error}`);
            return data;
        }
        catch (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }
    }
}
