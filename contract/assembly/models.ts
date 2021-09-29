import { context, PersistentUnorderedMap } from "near-sdk-as";

const PROTOCOL_VERSION = "7";

@nearBindgen
export class Profile {
  owner: string
  expiration: u32
  premium: boolean
  
  constructor(
    public displayname: string,
    public avatar: string,
    public description: string,
    public records: Map<string, string>
  ) {
      this.owner = context.sender
      this.expiration = 0
      this.premium = false
    }
}

export const recordsByOwner = new PersistentUnorderedMap<string, Profile>("Profile");