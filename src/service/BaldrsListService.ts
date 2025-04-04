import { BaldrsResponse, BaldrsList, HospitalList } from "../Types/index.js";
import { TornApiService } from "./TornApiService.js";

export class BaldrsListService {
    private tornService: TornApiService
    private UserCache: HospitalList[] = []

    constructor(tornService: TornApiService) {
        this.tornService = tornService
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
            .filter(enemy => Number(enemy.total.replace(',', '')) < userTotal - 300)
            .sort((a, b) => Number(b.lvl) - Number(a.lvl))
    }


    public async getAcceptableEnemies(userTotal: number): Promise<BaldrsList[]> {
        const enemies = await this.fetchList();
        return this.filterEnemies(enemies, userTotal);
    }

    public async getEnemy(userTotal: number, key: string): Promise<string | undefined> {
        const now = Date.now()
        const acceptableEnemies = (await this.getAcceptableEnemies(userTotal))
        .filter((enemy) => {
            const cacheIndex = this.UserCache.findIndex(user => user.id === enemy.id);
            if (cacheIndex !== -1) {
                if (this.UserCache[cacheIndex].release <= now) {
                    this.UserCache.splice(cacheIndex, 1);
                    return true;
                }
                return false;
            }
            return true
        });
        const chunkSize = 10;


        for (let i = 0; i < acceptableEnemies.length; i += chunkSize) {
            const availableEnemies: string[] = [];
            const chunk = acceptableEnemies.slice(i, i + chunkSize);

            await Promise.all(chunk.map(async (user) => {
                try {

                  const hospitalizedUntill = await this.tornService.checkHospital(user.id, key);

                  if (!hospitalizedUntill) {
                    availableEnemies.push(user.id)
                    this.UserCache.push({id: user.id,  release: Date.now() + 5 * 60 * 1000})
                  } else {
                    this.UserCache.push({id: user.id,  release: hospitalizedUntill})
                  }
                } catch (error) {
                  console.error(`Error checking hospital status for user ${user}:`, error);
                }
              }));
            if (availableEnemies.length) {
                return availableEnemies[0]
            }
        }

    }


}
