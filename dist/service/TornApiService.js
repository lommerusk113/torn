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
    async getFaction(factionId, apiKey) {
        return this._fetchFromTorn(`faction/${factionId}?selections=basic`, apiKey);
    }
    async checkHospital(userId, key) {
        const userData = await this.getUser(userId, key);
        return userData?.status?.state === "Hospital"
            ? userData.status.until
            : null;
    }
    async _fetchFromTorn(endpoint, key) {
        const cacheBuster = Date.now();
        const url = `${this.baseUrl}/${endpoint}&key=${key}&_cb=${cacheBuster}`;
        try {
            const response = await fetch(url, {
                headers: {
                    "Cache-Control": "no-cache, no-store",
                    Pragma: "no-cache",
                },
            });
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
