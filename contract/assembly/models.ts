import { context, PersistentMap } from "near-sdk-as";

const PROTOCOL_VERSION = "1";

@nearBindgen
export class Records {
  owner: string;
  
  constructor(
    public email: string,
    public expiration: u32,
    public settings: string,
    public premium: boolean,
    public name: string,
    public avatar: string,
    public description: string,
    public website: string,
    public location: string
  ) {
      this.owner = context.sender;
    }
}

export const recordsByOwner = new PersistentMap<string, Records>("Records");
