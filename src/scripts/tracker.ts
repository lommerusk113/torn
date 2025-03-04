import { FactionData, FactionMember, MemberWithId, MemberStatus } from "../Types/index.js"
import { TrackerRepository } from "../routes/faction/track/TrackerRespository.js"
import { TornApiService } from "../service/TornApiService.js"
import _ from 'lodash';

const repository = new TrackerRepository()
const tornApiService = new TornApiService()

const trackUsers = async () => {

    console.log("Tracking users...")
    const trackers = await repository.getActiveTrackers()

    if (trackers.length > 0) {

        const promises = trackers.map(async (element) => {
            const factionId = element.faction_id;
            const apiKey = element.api_key;

            const newData = await tornApiService.getFaction(factionId, apiKey)
            const members = mapTornData(newData.members)
            const storedData = await repository.getStatusData(factionId)
            const distinctData = getNewestUpdatePerMember(storedData)


            members.forEach(member => {
                const current: MemberStatus | undefined = distinctData?.find((x) => x?.member_id === member.id)

                if(!current || member.last_action.status !== current.status ) {

                    const newStatus: MemberStatus = {
                        faction_id: element.faction_id,
                        member_id:  member.id,
                        member_name: member.name,
                        status: member.last_action.status
                    }

                    repository.insertMemberStatus(newStatus)
                }
            });
        });

        const allFactionData = await Promise.all(promises);

    }

}

const mapTornData = (factionData: Record<string, FactionMember>) : MemberWithId[] => {
    return Object.entries(factionData).map(([id, member]) => ({
        id: parseInt(id),
        ...member
      }));
}

const getNewestUpdatePerMember = (statuses: MemberStatus[] | undefined): MemberStatus[] | undefined => {
    if (!statuses || !statuses.length) {
        return undefined;
    }
    const grouped = _.groupBy(statuses, 'member_id');
    return Object.values(grouped).map(memberStatuses =>
        _.maxBy(memberStatuses, status => new Date(status.created_at!).getTime())!
    );
};

export default trackUsers