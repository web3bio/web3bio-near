import { Context, logging, storage } from 'near-sdk-as'
import { Records, recordsByOwner } from "./models"

const DEFAULT_MESSAGE = 'Hello'

// getRecordByOwner for owner
export function getRecordByOwner(owner: string): Records | null  {
  let recordList = recordsByOwner.get(owner);
  logging.log("getRecordByOwner: " + owner);
  if (!recordList) {
    return null;
  }
  return recordList;
}

// setRecordByOwner for owner
export function setRecordByOwner(newRecordList: Records): void {
  const owner = Context.sender
  recordsByOwner.set(owner, newRecordList);
  logging.log("setRecordByOwner: " + owner);
}

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
  // This uses raw `storage.get`, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/roles/developer/contracts/assemblyscript#imports
  return storage.get<string>(accountId, DEFAULT_MESSAGE)
}

export function setGreeting(message: string): void {
  const account_id = Context.sender

  // Use logging.log to record logs permanently to the blockchain!
  logging.log(
    // String interpolation (`like ${this}`) is a work in progress:
    // https://github.com/AssemblyScript/assemblyscript/pull/1115
    'Saving greeting "' + message + '" for account "' + account_id + '"'
  )

  storage.set(account_id, message)
}
