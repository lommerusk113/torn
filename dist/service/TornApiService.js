export class TornApiService {
    baseUrl;
    constructor() {
        this.baseUrl = "https://api.torn.com";
    }
    async getUser(userId, key) {
        return this._fetchFromTorn(`user/${userId}?selections=basic`, key);
    }
    async getUserStats(userId, key) {
        return this._fetchFromTorn(`user/${userId}?selections=battlestats`, key);
    }
    async checkHospital(userId, key) {
        const userData = await this.getUser(userId, key);
        return userData?.status?.state === "Hospital";
    }
    async _fetchFromTorn(endpoint, key) {
        const url = `${this.baseUrl}/${endpoint}&key=${key}`;
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
