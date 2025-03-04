import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FactionTracker, MemberStatus } from '../../../Types/index.js';

export class TrackerRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || ''
    );
  }



  /**
   * Check if a faction tracker already exists
   */
  public async trackerExists(factionId: string): Promise<boolean> {
    console.log("checking if tracker exists")
    const { data, error } = await this.supabase
      .from('faction_trackers')
      .select('faction_id')
      .eq('faction_id', factionId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  }

  /**
   * Add a new faction tracker
   */
  public async addTracker(factionId: string, apiKey: string): Promise<FactionTracker | null> {

    console.log("Adding tracker")
    const tracker: FactionTracker = {
      faction_id: factionId,
      api_key: apiKey,
      is_active: true,
    };

    const { data, error } = await this.supabase
      .from('faction_trackers')
      .insert(tracker)
      .select()
      .single();

    if (error) {
      console.error('Error adding tracker:', error);
      return null;
    }

    return data;
  }


  /**
   * Remove a faction tracker
   */
  public async removeTracker(factionId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('faction_trackers')
      .update({ is_active: false })
      .eq('faction_id', factionId);

    if (error) {
      console.error('Error removing tracker:', error);
      return false;
    }

    return true;
  }

  /**
   * Get all active faction trackers
   */
  public async getActiveTrackers(): Promise<FactionTracker[]> {
    const { data, error } = await this.supabase
      .from('faction_trackers')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error getting active trackers:', error);
      return [];
    }

    return data || [];
  }

  public async insertMemberStatus(memberStatus: MemberStatus) {
    const { data, error } = await this.supabase
      .from('member_statuses')
      .insert(memberStatus)
      .select();

    if (error) throw error;

    return data;
  };

  public async getStatusData( factionId: string) :Promise<MemberStatus[] | undefined> {
    const { data, error } = await this.supabase
    .from('member_statuses')
    .select('*')
    .eq('faction_id', factionId)
    .order('member_id')

    if (error) {
      console.error('Error getting member history:', error);
      return undefined;
    }

    return data || undefined;
  }


  /**
   * Get status history for a specific member
   */
  public async getMemberData( memberId: string) :Promise<MemberStatus[] | undefined> {
    const { data, error } = await this.supabase
    .from('member_statuses')
    .select('*')
    .eq('member_id', memberId)

    if (error) {
      console.error('Error getting member history:', error);
      return undefined;
    }

    return data || undefined;
  }

}