import { BaldrsResponse, BaldrsList } from "../Types/index.js";

export class BaldrsListService {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.torn.com";
    }

    private async fetchList(): Promise<BaldrsResponse> {
        try {
            const response = await fetch('https://oran.pw/baldrstargets/data.json');
            return await response.json();
        } catch (error) {
            console.error("Error fetching enemies:", error);
            throw error;
        }
    }

    private filterEnemies(enemies: BaldrsResponse, userTotal: number): BaldrsList[] {
        const listKeys: (keyof BaldrsResponse)[] = userTotal < 1600
            ? ["Baldr's List 1", "Baldr's List 2", "Baldr's List 3"]
            : ["Baldr's Extra List 1", "Baldr's Extra List 2", "Baldr's Extra List 3"];

        return listKeys
            .flatMap(key => enemies[key] || [])
            .filter(enemy => Number(enemy.total) < userTotal - 200)
            .sort((a, b) => Number(b.lvl) - Number(a.lvl))
            .slice(0, 35);
    }


    public async getAcceptableEnemies(userTotal: number): Promise<BaldrsList[]> {
        const enemies = await this.fetchList();
        return this.filterEnemies(enemies, userTotal);
    }

    public async getFilteredEnemies(userTotal: number, tornService: any): Promise<BaldrsList[]> {
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
