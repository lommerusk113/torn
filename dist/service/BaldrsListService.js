export class BaldrsListService {
    apiKey;
    baseUrl;
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.torn.com";
    }
    async fetchList() {
        try {
            const response = await fetch('https://oran.pw/baldrstargets/data.json');
            return await response.json();
        }
        catch (error) {
            console.error("Error fetching enemies:", error);
            throw error;
        }
    }
    filterEnemies(enemies, userTotal) {
        const listKeys = userTotal < 1600
            ? ["Baldr's List 1", "Baldr's List 2", "Baldr's List 3"]
            : ["Baldr's Extra List 1", "Baldr's Extra List 2", "Baldr's Extra List 3"];
        return listKeys
            .flatMap(key => enemies[key] || [])
            .filter(enemy => Number(enemy.total) < userTotal - 200)
            .sort((a, b) => Number(b.lvl) - Number(a.lvl))
            .slice(0, 35);
    }
    async getAcceptableEnemies(userTotal) {
        const enemies = await this.fetchList();
        return this.filterEnemies(enemies, userTotal);
    }
    async getFilteredEnemies(userTotal, tornService) {
        const acceptableEnemies = await this.getAcceptableEnemies(userTotal);
        const filteredEnemies = [];
        for (const enemy of acceptableEnemies) {
            if (!(await tornService.checkHospital(enemy.id))) {
                filteredEnemies.push(enemy);
            }
        }
        return filteredEnemies;
    }
}
