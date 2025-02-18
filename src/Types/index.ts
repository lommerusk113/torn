export type BaldrsList = {
    name: string,
    id: string,
    lvl: string,
    total: string,
    str: string,
    def: string,
    spd: string,
    dex: string
}

export type BaldrListKey =
  | "Baldr's List 1"
  | "Baldr's List 2"
  | "Baldr's List 3"
  | "Baldr's Extra List 1"
  | "Baldr's Extra List 2"
  | "Baldr's Extra List 3"
  | "Baldr's DOMINO List";

 export type BaldrsResponse = Record<BaldrListKey, BaldrsList[]>;