// interfaces.ts
import { WarMember, FactionMember } from "../Types/index.js";

export interface ITornApiService {
  getFaction(factionId: string, apiKey: string): Promise<any>;
}

export interface IApiKeyRepository {
  getRandomKey(): Promise<string>;
}

export interface IWarTrackerRepository {
  getFactionData(factionId: string): Promise<WarMember[]>;
  updateFactionData(member: WarMember): Promise<void>;
  insert(member: WarMember): Promise<void>;
  deleteFactionData(factionId: string): Promise<void>;
}