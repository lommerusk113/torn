import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { WarMember } from "../Types/index.js";

let gFactionData = 0;
let dFactionData = 0;
let iFactionData = 0;
let uFactionData = 0;

export class WarTrackerRepository {
	private supabase: SupabaseClient;
	private table: string = "war_tracker";

	constructor(client?: SupabaseClient) {
		this.supabase =
			client ||
			createClient(
				process.env.SUPABASE_URL || "",
				process.env.SUPABASE_KEY || ""
			);
	}

	public async getFactionData(factionId: string): Promise<WarMember[]> {
		const { data, error } = await this.supabase
			.from(this.table)
			.select()
			.eq("faction_id", factionId);

		gFactionData = gFactionData + 1;

		if (gFactionData % 100 === 0) {
			console.log(`getFactionData has been called ${gFactionData} times`);
		}

		if (error) {
			throw error;
		}

		return data || [];
	}

	public async deleteFactionData(factionId: string): Promise<void> {
		const { data, error } = await this.supabase
			.from(this.table)
			.delete()
			.eq("faction_id", factionId);

		dFactionData = dFactionData + 1;

		if (dFactionData % 100 === 0) {
			console.log(`deleteFactionData has been called ${dFactionData} times`);
		}

		if (error) {
			throw error;
		}
	}

	public async insert(member: WarMember): Promise<void> {
		const { error } = await this.supabase.from(this.table).insert(member);

		iFactionData = iFactionData + 1;

		if (iFactionData % 100 === 0) {
			console.log(`insertFactionData has been called ${iFactionData} times`);
		}

		if (error) {
			console.log("Error inserting user data");
			console.log("got error: ", error);
		}
	}

	public async updateFactionData(member: WarMember): Promise<void> {
		const { error } = await this.supabase
			.from(this.table)
			.update(member)
			.eq("member_id", member.member_id);

		uFactionData = uFactionData + 1;

		if (uFactionData % 100 === 0) {
			console.log(`updateFactionData has been called ${uFactionData} times`);
		}

		if (error) {
			console.log("error updating member data");
			console.log("got error: ", error);
		}
	}
}

export default WarTrackerRepository;
