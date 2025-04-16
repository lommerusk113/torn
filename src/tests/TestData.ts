import type { WarMember } from "../Types/index.js";

export const tornApiResponse = {
	ID: 42133,
	name: "A Ballet of Swans",
	tag: "GRS",
	tag_image: "42133-86075.png",
	leader: 3290510,
	"co-leader": 2131542,
	respect: 301868,
	age: 2275,
	capacity: 50,
	best_chain: 500,
	ranked_wars: {},
	territory_wars: {},
	raid_wars: {},
	peace: {},
	rank: {
		level: 5,
		name: "Bronze",
		division: 3,
		position: 0,
		wins: 20,
	},
	members: {
		"274240": {
			name: "xXR1CKYXx",
			level: 55,
			days_in_faction: 1004,
			last_action: {
				status: "Offline",
				timestamp: 1743102651,
				relative: "3 hours ago",
			},
			status: {
				description: "Okay",
				details: "",
				state: "Okay",
				color: "green",
				until: 0,
			},
			position: "Big High War God",
		},
		"1361562": {
			name: "destrutor09",
			level: 27,
			days_in_faction: 29,
			last_action: {
				status: "Offline",
				timestamp: 1743112907,
				relative: "29 minutes ago",
			},
			status: {
				description: "Returning to Torn from South Africa",
				details: "",
				state: "Traveling",
				color: "blue",
				until: 0,
			},
			position: "Blood Thicker Than Water",
		},
		"2504569": {
			name: "Salt_Lord",
			level: 23,
			days_in_faction: 29,
			last_action: {
				status: "Offline",
				timestamp: 1743108497,
				relative: "1 hour ago",
			},
			status: {
				description: "Traveling to South Africa",
				details: "",
				state: "Traveling",
				color: "blue",
				until: 0,
			},
			position: "Member",
		},
		"3518349": {
			name: "Cortiom",
			level: 18,
			days_in_faction: 29,
			last_action: {
				status: "Offline",
				timestamp: 1743108497,
				relative: "1 hour ago",
			},
			status: {
				description: "In UAE",
				details: "",
				state: "Abroad",
				color: "blue",
				until: 0,
			},
			position: "Member",
		},
		"3593952": {
			name: "SkjeggeLadd",
			level: 26,
			days_in_faction: 65,
			last_action: {
				status: "Idle",
				timestamp: 1744794676,
				relative: "2 minutes ago",
			},
			status: {
				description: "In hospital for 1 hrs 3 mins ",
				details: "Severe emesis following Ipecac Syrup ingestion",
				state: "Hospital",
				color: "red",
				until: 1744798620,
			},
			position: "Adventurer",
		},
	},
};

export const originalStatus = {
	members: {
		"274240": {
			name: "xXR1CKYXx",
			level: 55,
			days_in_faction: 1004,
			last_action: {
				status: "Offline",
				timestamp: 1743116378540,
				relative: "3 hours ago",
			},
			status: {
				description: "Okay",
				details: "",
				state: "Okay",
				color: "green",
				until: 0,
			},
			position: "Big High War God",
		},
	},
};

export const newStatus = {
	members: {
		"274240": {
			name: "xXR1CKYXx",
			level: 55,
			days_in_faction: 1004,
			last_action: {
				status: "Offline",
				timestamp: 1743116378540,
				relative: "3 hours ago",
			},
			status: {
				description: "Traveling to South Africa",
				details: "",
				state: "Traveling",
				color: "blue",
				until: 0,
			},
			position: "Big High War God",
		},
	},
};

export const oldStoredData = [
	{
		member_id: 274240,
		member_name: "xXR1CKYXx",
		level: 55,
		faction_id: "42133",
		activity: "Offline",
		status: { userStatus: "Okay", untill: undefined },
		location: { current: "Torn", destination: undefined, initiated: undefined },
	},
];

export const dataToBeStored = [
	{
		member_id: 274240,
		member_name: "xXR1CKYXx",
		level: 55,
		faction_id: "42133",
		activity: "Offline",
		status: { userStatus: "Traveling", untill: undefined },
		location: {
			current: "Torn",
			destination: "South Africa",
			initiated: 1743116378540,
		},
	},
];

export const expectedResult = [
	{
		member_id: 274240,
		member_name: "xXR1CKYXx",
		level: 55,
		faction_id: "42133",
		activity: "Offline",
		status: { userStatus: "Okay", untill: undefined },
		location: { current: "Torn", destination: undefined, initiated: undefined },
	},
	{
		member_id: 1361562,
		member_name: "destrutor09",
		level: 27,
		faction_id: "42133",
		activity: "Offline",
		status: { userStatus: "Traveling", untill: undefined },
		location: {
			destination: "Torn",
			current: "South Africa",
			initiated: 1743116378540,
		},
	},
	{
		member_id: 2504569,
		member_name: "Salt_Lord",
		level: 23,
		faction_id: "42133",
		activity: "Offline",
		status: { userStatus: "Traveling", untill: undefined },
		location: {
			current: "Torn",
			destination: "South Africa",
			initiated: 1743116378540,
		},
	},
	{
		member_id: 3518349,
		member_name: "Cortiom",
		level: 18,
		faction_id: "42133",
		activity: "Offline",
		status: { userStatus: "Abroad", untill: undefined },
		location: { current: "UAE", destination: undefined, initiated: undefined },
	},
	{
		member_id: 3593952,
		member_name: "SkjeggeLadd",
		level: 26,
		faction_id: "42133",
		activity: "Idle",
		status: { userStatus: "Hospital", untill: 1744798620000 },
		location: { current: "Torn" },
	},
];

export const askeladds = {
	ID: 41309,
	name: "Askeladds",
	ranked_wars: {
		"23691": {
			factions: {
				"41309": {
					name: "Askeladds",
				},
				"42133": {
					name: "A Ballet of Swans",
				},
			},
		},
	},
	members: {},
};

export const notAtWar = {
	ID: 41309,
	name: "Askeladds",
	ranked_wars: {},
	members: {},
};
