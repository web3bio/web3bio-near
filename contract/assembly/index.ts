import { Context, logging } from 'near-sdk-as'
import { Profile, Records, Crypto, recordsByOwner } from "./models"

const DEBUG = false;

// getRecordByOwner for owner
export function getRecordByOwner(owner: string): Profile | null  {
  let recordList = recordsByOwner.get(owner);
  logging.log("getRecordByOwner: " + owner);
  if (!recordList) {
    return null;
  }
  return recordList
}

// setRecordByOwner for owner
export function setRecordByOwner(
  name: string,
  avatar: string,
  description: string,
  location: string,
  theme: string,
  records: Records,
  crypto: Crypto
): void {
  const owner = Context.sender;

  const newRecordList = new Profile(
    name,
    avatar,
    description,
    location,
    theme,
    records,
    crypto
  );

  recordsByOwner.set(owner, newRecordList);
  logging.log("setRecordByOwner: " + owner);
}

// delRecordByOwner for owner
export function delRecordByOwner(owner: string): void  {
  recordsByOwner.delete(owner);
  logging.log("delRecordByOwner: " + owner);
}