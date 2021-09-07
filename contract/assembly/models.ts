import { context, PersistentMap } from "near-sdk-as";

const PROTOCOL_VERSION = "1";

@nearBindgen
export class Records {
  owner: string;
  settings: string;
  premium: boolean;
  name: string;
  avatar: string;
  description: string;
  website: string;
  location: string;
  phone: string;

  constructor(
    public email: string,
    public expiration: u64,
    // public records: PersistentMap<string, string>
  ) {
      this.owner = context.sender;
      // this.records = new PersistentMap<string, string>(`${this.owner}-records`);
    }
}

export const recordsByOwner = new PersistentMap<string, Records>("Records");
