import { Context, logging, storage } from 'near-sdk-as'
import { Records, Social, recordsByOwner } from "./models"

const DEBUG = false;

// getRecordByOwner for owner
export function getRecordByOwner(owner: string): Records | null  {
  let recordList = recordsByOwner.get(owner);
  logging.log("getRecordByOwner: " + owner);
  if (!recordList) {
    return null;
  }
  return recordList
}

// setRecordByOwner for owner
export function setRecordByOwner(
  email: string,
  settings: string,
  premium: boolean,
  name: string,
  avatar: string,
  description: string,
  website: string,
  location: string,
  social: Social
): void {
  const owner = Context.sender;

  const newRecordList = new Records(
    email,
    settings,
    premium,
    name,
    avatar,
    description,
    website,
    location,
    social
  );

  recordsByOwner.set(owner, newRecordList);
  logging.log("setRecordByOwner: " + owner);
}
