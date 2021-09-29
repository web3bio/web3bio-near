import { Context, logging } from 'near-sdk-as'
import { Profile, recordsByOwner } from "./models"

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
  displayname: string,
  avatar: string,
  description: string,
  records: Map<string, string>,
): void {
  const owner = Context.sender;

  const newRecordList = new Profile(
    displayname,
    avatar,
    description,
    records
  );

  recordsByOwner.set(owner, newRecordList);
  logging.log("setRecordByOwner: " + owner);
}

// delRecordByOwner for owner
export function delRecordByOwner(owner: string): void  {
  recordsByOwner.delete(owner);
  logging.log("delRecordByOwner: " + owner);
}