export class BaldrsListService {
    tornService;
    constructor(tornService) {
        this.tornService = tornService;
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
            .filter(enemy => Number(enemy.total) < userTotal - 300)
            .sort((a, b) => Number(b.lvl) - Number(a.lvl));
    }
    async getAcceptableEnemies(userTotal) {
        const enemies = await this.fetchList();
        return this.filterEnemies(enemies, userTotal);
    }
    async getEnemy(userTotal, key) {
        const acceptableEnemies = await this.getAcceptableEnemies(userTotal);
        const chunkSize = 10;
        for (let i = 0; i < acceptableEnemies.length; i += chunkSize) {
            const availableEnemies = [];
            const chunk = acceptableEnemies.slice(i, i + chunkSize);
            await Promise.all(chunk.map(async (user) => {
                try {
                    const isInHospital = await this.tornService.checkHospital(user.id, key);
                    if (!isInHospital) {
                        console.log(`user: ${user.name} in hospital: ${isInHospital}`);
                        availableEnemies.push(user.id);
                    }
                }
                catch (error) {
                    console.error(`Error checking hospital status for user ${user}:`, error);
                }
            }));
            if (availableEnemies.length) {
                return availableEnemies[0];
            }
        }
    }
}
