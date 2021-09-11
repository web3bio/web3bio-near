import { context, PersistentMap } from "near-sdk-as";

const PROTOCOL_VERSION = "5";

@nearBindgen
export class Profile {
  owner: string
  expiration: u32
  premium: boolean
  
  constructor(
    public name: string,
    public avatar: string,
    public description: string,
    public location: string,
    public theme: string,
    public records: Records = new Records(),
    public crypto: Crypto = new Crypto(),
  ) {
      this.owner = context.sender
      this.expiration = 0
      this.premium = false
    }
}

@nearBindgen
export class Records {
  constructor(
    public email: string = '',
    public website: string = '',
    public twitter: string = '',
    public facebook: string = '',
    public linkedin: string = '',
    public github: string = '',
    public telegram: string = '',
    public instagram: string = '',
    public youtube: string = '',
    public discord: string = '',
    public patreon: string = '',
    public paypal: string = ''
  ) {}
}

@nearBindgen
export class Crypto {
  near: string

  constructor(
    public btc: string = '',
    public eth: string = '',
    public dot: string = ''
  ) {
    this.near = context.sender
  }
}

export const recordsByOwner = new PersistentMap<string, Profile>("Profile");