import { TornApiService } from "../service/TornApiService.js"
import ApiKeyRepository from "../repository/ApiKeyRepository.js"
import WarTrackerRepository from "../repository/WarTrackerRepository.js"
import { WarMember, FactionMember, MemberWithId, UserStatus, Status, Location, Locations } from "../Types/index.js"

const repository = new WarTrackerRepository()
const apiKeyRepository = new ApiKeyRepository()
const tornApiService = new TornApiService()
const askeLadds = '41309'
let factionId: string

const track = () => {
    try {
        handleTracking()
    } catch(err: any) {
        console.log(err)
    }
}

const handleTracking = async () => {
    const key = await apiKeyRepository.getRandomKey()
    const faction = await tornApiService.getFaction(factionId, key)
    const members = mapTornData(faction.members)

    const storedMembers = await getStoredData()

    const data: WarMember[] = members.map((member: MemberWithId) => {

        const current:WarMember | undefined = storedMembers.find(x => x.member_id === member.id)
        const location = getLocation(member.status.description)

        return {
            member_id: member.id,
            member_name: member.name,
            level: member.level,
            faction_id: factionId,
            activity: member.last_action.status,
            status: {userStatus: member.status.state, untill: member.status.until || undefined},
            location: current?.location.current === location.current ? current : location,
        } as WarMember

    })

    for (const item of data) {
        if (storedMembers.length > 0) {
            await repository.updateFactionData(item)
        } else {
            await repository.insert(item)
        }

    }
}

const getEnemy = async () => {
    const key = await apiKeyRepository.getRandomKey()
    const faction = await tornApiService.getFaction(askeLadds, key)

    const warId = Object.keys(faction.ranked_wars)[0];
    const war = faction.ranked_wars[warId];

    const factionIds = Object.keys(war.factions);

    const opponentId = factionIds.find(id => id !== "41309");
    factionId = opponentId!
}

const getLocation = (description: string) => {

    let location: Location = {} as Location

    const temp = description.split(Locations.torn)

    if (temp.length > 1) {
        location.destination = Locations.torn
        location.current = Object.values(Locations).find(x => temp[1].includes(x))!
    } else {
        location.current = Locations.torn
        location.destination = Object.values(Locations).find(x => description.includes(x))!
    }

    location.initiated = Date.now()

    return location
}

const getStoredData = async () => {
    try {
      return await repository.getFactionData(factionId);
    } catch (error) {
      console.error("Failed to fetch faction data:", error);
      return [];
    }
  }

const mapTornData = (factionData: Record<string, FactionMember>) : MemberWithId[] => {
    return Object.entries(factionData).map(([id, member]) => ({
        id: parseInt(id),
        ...member
      }));
}


export {getEnemy, track}
