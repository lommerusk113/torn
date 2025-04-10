import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class ApiKeyRepository {
	private supabase: SupabaseClient;

	constructor() {
		this.supabase = createClient(
			process.env.SUPABASE_URL || "",
			process.env.SUPABASE_KEY || ""
		);
	}

	/**
	 * Gets a random api key from the database
	 * @returns key as string
	 */
	public async getRandomKey(): Promise<string> {
		const { data, error } = await this.supabase.from("api_keys").select("key");

		if (error) {
			console.log(new Date());
			console.log("error fetching api keys: ", error);
			return "bbeF5JKpKyPtdCQF";
		}

		return data[Math.floor(Math.random() * data.length)].key;
	}

	/**
	 * Deletes an API key from the database
	 * @param key The ID of the API key to delete
	 * @returns True if deletion was successful, false otherwise
	 */
	public async deleteKey(key: string): Promise<boolean> {
		const { error } = await this.supabase
			.from("api_keys")
			.delete()
			.eq("key", key);

		if (error) {
			console.error(`Failed to delete API key: ${error.message}`);
			return false;
		}

		return true;
	}
}

export default ApiKeyRepository;
