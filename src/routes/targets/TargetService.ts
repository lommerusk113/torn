import { BaldrsListService } from "../../service/BaldrsListService.js"
import { TornApiService } from "../../service/TornApiService.js"
import { BaldrsList } from "../../Types/index.js"

export class TargetService {

    private tornService: TornApiService
    private blService: BaldrsListService

    constructor(tornService: TornApiService, blService: BaldrsListService) {
      this.tornService = tornService
      this.blService = blService
    }

    public async getTargetUrl(userId: string, key: string) {
      const user = await this.tornService.getUserStats(userId, key);
      const userTotal: number = user.total + user.strength_modifier + user.defense_modifier + user.speed_modifier + user.dexterity_modifier

      const enemy = await this.blService.getEnemy(userTotal, key);

      if (enemy) {
        return `https://www.torn.com/profiles.php?XID=${enemy}`;
      } else {
        return undefined
      }

    }
  }

