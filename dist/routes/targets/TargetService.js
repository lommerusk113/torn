export class TargetService {
    tornService;
    blService;
    constructor(tornService, blService) {
        this.tornService = tornService;
        this.blService = blService;
    }
    async getTargetUrl(userId, key) {
        const user = await this.tornService.getUserStats(userId, key);
        const userTotal = user.total + user.strength_modifier + user.defense_modifier + user.speed_modifier + user.dexterity_modifier;
        const enemy = await this.blService.getEnemy(userTotal, key);
        if (enemy) {
            return `https://www.torn.com/profiles.php?XID=${enemy}`;
        }
        else {
            return undefined;
        }
    }
}
