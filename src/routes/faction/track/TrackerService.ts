import { TrackerRepository } from './TrackerRespository.js';
import { BaldrsListService } from "../../../service/BaldrsListService.js"
import { TornApiService } from "../../../service/TornApiService.js"
import {MemberStatusRecord, MemberStatus} from '../../../Types/index.js'

export class TrackerService {

    private tornService: TornApiService
    private trackerRepository: TrackerRepository

    constructor(tornService: TornApiService, trackerRepository: TrackerRepository) {
      this.tornService = tornService
      this.trackerRepository = trackerRepository
    }

    private async trackerExists(factionId: string): Promise<boolean> {
      return this.trackerRepository.trackerExists(factionId)
    }

    public async addTracker(factionId: string, apiKey: string) {
      const exists = await this.trackerExists(factionId)
      if (exists) {
        return true
      }

      return this.trackerRepository.addTracker(factionId, apiKey)
    }

    public async removeTracker(factionId: string) {
      const exists = await this.trackerExists(factionId)
      if (!exists) {
        return true
      }

      return this.trackerRepository.removeTracker(factionId)

    }

    public async getAllMembers(factionId: string) {
      const data = await this.trackerRepository.getStatusData(factionId)
      return this.mapMemberStatusData(data || [])
    }

    public async getMemberHistory(memberId: string) {
      const data = await this.trackerRepository.getMemberData(memberId)
      return this.mapMemberStatusData(data || [])
    }

    private mapMemberStatusData(data: MemberStatus[]): Record<number, MemberStatusRecord> {
      const memberMap: Record<number, MemberStatusRecord> = {};

      // First, group all statuses by member_id
      data.forEach(item => {
        if (!memberMap[item.member_id]) {
          memberMap[item.member_id] = {
            member_id: item.member_id,
            member_name: item.member_name,
            statusHistory: []
          };
        }

        memberMap[item.member_id].statusHistory.push({
          timestamp: item.created_at,
          status: item.status
        });
      });

      // Then, sort each member's status history by timestamp
      Object.values(memberMap).forEach(member => {
        member.statusHistory.sort((a, b) =>
          new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()
        );
      });

      return memberMap;
    }


    //public async getAllTrackers() {
    // return this.trackerRepository.getAllTrackers()
    //}
  }

