import { TornApiService } from "../service/TornApiService.js"
import ApiKeyRepository from "../repository/ApiKeyRepository.js"
import WarTrackerRepository from "../repository/WarTrackerRepository.js"
import { WarMember, FactionMember, MemberWithId, UserStatus, Status, Location, Locations } from "../Types/index.js"

const repository = new WarTrackerRepository()
const apiKeyRepository = new ApiKeyRepository()
const tornApiService = new TornApiService()
const askeLadds = '41309'
let factionId: string
let retries = 0

const track = async () => {
    try {
        await handleTracking()
    } catch(err: any) {
        console.log("Tracking failed")
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

        const location = getLocation(member.status.description, member.status.state, current?.location)

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

    if (!faction) {
        console.log("could not get faction from torn, in getEnemy")
        factionId = askeLadds
        return
    }

    const warId = Object.keys(faction.ranked_wars)[0];
    const war = faction.ranked_wars[warId];

    if (!war) {
        factionId = askeLadds
        return
    }

    const factionIds = Object.keys(war.factions);

    const opponentId = factionIds.find(id => id !== "41309");
    factionId = opponentId!
}

const getLocation = (description: string, state: string, current?: Location) => {

    let location: Location = {} as Location

    if (state !== UserStatus.traveling) {
        location.current = Object.values(Locations).find(x => description.includes(x)) || Locations.torn
    }

    const temp = description.split(Locations.torn)

    if (temp.length > 1) {
        location.destination = Locations.torn
        location.current = Object.values(Locations).find(x => temp[1].includes(x))!
    } else {
        location.current = Locations.torn
        location.destination = Object.values(Locations).find(x => description.includes(x))!
    }

    let now = Date.now()
    if (now > 20000000000) {
        now = now / 1000
    }

    if (current?.current !== location.current || current?.destination !== location.destination) {
        location.initiated = now
    }

    return location
}

const getStoredData = async () => {
    try {
      return await repository.getFactionData(factionId);
    } catch (error) {
      console.log("Failed to fetch faction data:", error);
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
