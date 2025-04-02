import type { WarMember } from "../Types/index.js"

export const tornApiResponse = {
    "ID": 42133,
    "name": "A Ballet of Swans",
    "tag": "GRS",
    "tag_image": "42133-86075.png",
    "leader": 3290510,
    "co-leader": 2131542,
    "respect": 301868,
    "age": 2275,
    "capacity": 50,
    "best_chain": 500,
    "ranked_wars": {},
    "territory_wars": {},
    "raid_wars": {},
    "peace": {},
    "rank": {
      "level": 5,
      "name": "Bronze",
      "division": 3,
      "position": 0,
      "wins": 20
    },
    "members": {
      "274240": {
        "name": "xXR1CKYXx",
        "level": 55,
        "days_in_faction": 1004,
        "last_action": {
          "status": "Offline",
          "timestamp": 1743102651,
          "relative": "3 hours ago"
        },
        "status": {
          "description": "Okay",
          "details": "",
          "state": "Okay",
          "color": "green",
          "until": 0
        },
        "position": "Big High War God"
      },
      "1361562": {
        "name": "destrutor09",
        "level": 27,
        "days_in_faction": 29,
        "last_action": {
          "status": "Offline",
          "timestamp": 1743112907,
          "relative": "29 minutes ago"
        },
        "status": {
          "description": "Returning to Torn from South Africa",
          "details": "",
          "state": "Traveling",
          "color": "blue",
          "until": 0
        },
        "position": "Blood Thicker Than Water"
      },
      "3518349": {
        "name": "Cortiom",
        "level": 18,
        "days_in_faction": 29,
        "last_action": {
          "status": "Offline",
          "timestamp": 1743108497,
          "relative": "1 hour ago"
        },
        "status": {
          "description": "In UAE",
          "details": "",
          "state": "Abroad",
          "color": "blue",
          "until": 0
        },
        "position": "Member"
      }
    }
  }

  export const expectedResult = [
    {
      "member_id": 274240,
      "member_name": "xXR1CKYXx",
      "level": 55,
      "faction_id": "42133",
      "activity": "Offline",
      "status": { "userStatus": "Okay", "untill": undefined },
      "location": { "current": "Torn", "destination": undefined, "initiated": 1743116378.54 }
    },
    {
      "member_id": 1361562,
      "member_name": "destrutor09",
      "level": 27,
      "faction_id": "42133",
      "activity": "Offline",
      "status": { "userStatus": "Traveling", "untill": undefined },
      "location": {
        "destination": "Torn",
        "current": "South Africa",
        "initiated": 1743116378.54
      }
    },
    {
      "member_id": 3518349,
      "member_name": "Cortiom",
      "level": 18,
      "faction_id": "42133",
      "activity": "Offline",
      "status": { "userStatus": "Abroad", "untill": undefined },
      "location": { "current": "Torn", "destination": "UAE", "initiated": 1743116378.54 }
    }
  ]

  export const askeladds = {
    "ID": 41309,
    "name": "Askeladds",
    "ranked_wars": {
      "23691": {
        "factions": {
          "41309": {
            "name": "Askeladds"
          },
          "42133": {
            "name": "A Ballet of Swans"
          }
        }
      }
    },
    "members": {}
  }