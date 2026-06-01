import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) console.error('MONGODB_URI not defined');

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
      .then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
