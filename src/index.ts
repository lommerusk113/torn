import { BaldrsListService } from "./service/BaldrsListService.js"
import { TornApiService } from "./service/TornApiService.js"
import { BaldrsList } from "./Types/index.js"

const apiKey = ''
const userId = '3593952'

const tornService = new TornApiService(apiKey)
const blService = new BaldrsListService(apiKey)

const user = await tornService.getUserStats(userId);
const userTotal: number = user.total + user.strength_modifier + user.defense_modifier + user.speed_modifier + user.dexterity_modifier

const filteredEnemies = await blService.getFilteredEnemies(userTotal, tornService);


console.log(filteredEnemies)


