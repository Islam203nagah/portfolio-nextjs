import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://islam:SUinfm%4020320@cluster0.lfeisnx.mongodb.net/Portfiolo';
const options = {};

let clientPromise: Promise<MongoClient>;

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!globalThis.__mongoClientPromise) {
  globalThis.__mongoClientPromise = new MongoClient(uri, options).connect();
}

clientPromise = globalThis.__mongoClientPromise;

export default clientPromise;
