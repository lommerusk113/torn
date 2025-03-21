import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WarMember } from "../Types/index.js"

export class WarTrackerRepository {
  private supabase: SupabaseClient;
  private table: string = 'war_tracker'

  constructor() {

    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || ''
    );
  }


  public async getFactionData(factionId: string): Promise<WarMember[]> {
    const { data, error } = await this.supabase
    .from(this.table)
    .select()
    .eq('faction_id', factionId)

    if (error) {
      throw error
    }

    return data || []
  }

  public async insert(member: WarMember ): Promise<void> {
    const { error } = await this.supabase
    .from(this.table)
    .insert(member)

    if (error) {
      console.log("Error inserting user data")
      console.log("got error: ", error)
    }
  }

  public async updateFactionData(member: WarMember ): Promise<void> {
    const { error } = await this.supabase
    .from(this.table)
    .update(member)
    .eq('member_id', member.member_id)

  if (error) {
    console.log("error updating member data")
    console.log("got error: ", error)
  }
  }

}

export default WarTrackerRepository