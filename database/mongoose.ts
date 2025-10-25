import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;
if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}


export const connectToDatabase = async () => {
    if(!MONGODB_URI) throw new Error("MONGODB_URI harus di isi didalam .env");

    if(cached.conn) return cached.conn; // jika ada gunakan
    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }) // jika tidak buat baru
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    console.log(`Berhasil terhubung didatabase ${process.env.NODE_ENV} - ${MONGODB_URI}`)
}