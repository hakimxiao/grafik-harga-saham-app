import { connectToDatabase } from "../database/mongoose";

async function main() {
    try {
        await connectToDatabase();
        // If connectToDatabase resolves without throwing, connection is OK
        console.log("OK: Koneksi database berhasil");
        process.exit(0);
    } catch (err) {
        console.error("KESALAHAN: Koneksi database gagal");
        console.error(err);
        process.exit(1);
    }
}

main();