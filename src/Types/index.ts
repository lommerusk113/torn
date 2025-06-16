export type BaldrsList = {
	name: string;
	id: string;
	lvl: string;
	total: string;
	str: string;
	def: string;
	spd: string;
	dex: string;
};

export type BaldrListKey =
	| "Baldr's List 1"
	| "Baldr's List 2"
	| "Baldr's List 3"
	| "Baldr's Extra List 1"
	| "Baldr's Extra List 2"
	| "Baldr's Extra List 3"
	| "Baldr's DOMINO List";

export type BaldrsResponse = Record<BaldrListKey, BaldrsList[]>;

export type HospitalList = {
	id: string;
	release: number;
};

export interface FactionData {
	ID: number;
	name: string;
	leader: number;
	"co-leader": number;
	respect: number;
	age: number;
	best_chain: number;
	ranked_wars: Record<string, any>;
	peace: Record<string, any>;
	members: Record<string, FactionMember>;
}

export interface MemberWithId extends FactionMember {
	id: number;
}

export interface FactionMember {
	name: string;
	level: number;
	days_in_faction: number;
	last_action: {
		status: Status;
		timestamp: number;
		relative: string;
	};
	status: {
		description: string;
		details: string;
		state: string;
		until: number;
	};
	position: string;
}

export enum Status {
	Idle,
	Online,
	Offline,
}

export interface FactionTracker {
	id?: number;
	faction_id: string;
	api_key: string;
	is_active: boolean;
}

export interface MemberStatus {
	id?: number;
	faction_id: string;
	member_id: number;
	member_name: string;
	status: Status;
	created_at?: string;
}

export interface MemberStatusRecord {
	member_id: number;
	member_name: string;
	statusHistory: {
		timestamp?: string;
		status: Status;
	}[];
}

export enum UserStatus {
	hospital = "Hospital",
	okay = "Okay",
	traveling = "Traveling",
}

export interface UserState {
	userStatus: UserStatus;
	untill?: string;
}

export interface Stats {
	str: string;
	def: string;
	spd: string;
	dex: string;
}

export interface Location {
	current: string;
	destination?: string;
	initiated?: number;
}

export interface Combatstats {
	bsp: number;
	strength?: number;
	defence?: number;
	speed?: number;
	dexterity?: number;
}

export interface WarMember {
	id?: number;
	member_id: number;
	member_name: string;
	faction_id: string;
	activity: Status;
	status: UserState;
	stats?: Stats;
	destination?: string;
	location: Location;
	level: number;
	bsp?: number;
	strength?: number;
	defence?: number;
	dexterity?: number;
	speed?: number;
	discord_id: string;
	alerted: boolean;
}

export enum HospitalAbroad {
	canadian = "Canadian",
	emirati = "Emirati",
	british = "British",
	south_african = "South African",
	argentinian = "Argentinian",
	hawaiian = "Hawaiian",
	caymanian = "Caymanian",
	mexican = "Mexican",
	japanese = "Japanese",
	chineese = "Chinese",
	swiss = "Swiss",
}

export enum Locations {
	torn = "Torn",
	china = "China",
	japan = "Japan",
	hawaii = "Hawaii",
	mexico = "Mexico",
	canada = "Canada",
	cayman_islands = "Cayman Islands",
	argentina = "Argentina",
	england = "United Kingdom",
	switzerland = "Switzerland",
	dubai = "UAE",
	south_africa = "South Africa",
}
