# 🤖 AI STOCK MARKET APP

#### https://jsmastery.com/video-kit/7df14775-f594-4367-9941-9abce7d82de2?utm_source=youtube&utm_campaign=stocks-inngest

Aplikasi **AI Stock Market** ini merupakan proyek berbasis **Node.js + TypeScript** yang mengintegrasikan beberapa layanan utama:  
**AI (Gemini Studio)**, **database cloud (MongoDB Atlas)**, **sistem event (Inngest)**, **pengiriman email (Nodemailer)**, dan **API pasar saham (Finnhub)**.  
Tujuan aplikasi ini adalah untuk memberikan **prediksi, notifikasi, dan ringkasan pasar saham otomatis** dengan bantuan AI dan event scheduler.

---

## 🧠 AI STUDIO (GEMINI)

**Akun digunakan:** Ucok Pakpahan

### 🧩 Peran:
Gemini digunakan untuk menghasilkan analisis dan konten AI seperti:
- Prediksi tren saham.
- Ringkasan berita pasar harian.
- Rekomendasi personal berdasarkan profil pengguna.

### 🔗 Integrasi:
Aplikasi memanggil Gemini melalui **API key** yang tersimpan aman di variabel lingkungan (environment variables).

### 💬 Catatan Prompt:
Semua prompt ditulis dalam **bahasa Inggris**, namun diarahkan agar **output dihasilkan dalam bahasa Indonesia** sesuai gaya profesional dan komunikatif.

---

## 🍃 MONGODB ATLAS

**Akun digunakan:** fhkim

### 🧩 Peran:
MongoDB Atlas digunakan sebagai **database utama** untuk menyimpan:
- Data pengguna (`users`)
- Riwayat analisis dan prediksi saham
- Log aktivitas dan event

### 🔗 Koneksi:
Menggunakan **Mongoose (ODM)** dengan struktur modular melalui `connectToDatabase()` untuk koneksi aman dan efisien.

### 💡 Contoh Query Penting:
```js
const users = await db.collection("users").find(
  { email: { $exists: true, $ne: null } },
  { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
).toArray();
```
➤ Artinya: ambil semua pengguna yang memiliki email valid dan tampilkan hanya field penting seperti _id, id, email, name, dan country.

#### ⚙️ INNGEST (EVENT & CRON SYSTEM)
💻 CLI Command untuk menjalankan secara lokal:
```bash
Copy code
npx inngest-cli@latest dev
```
#### 🧩 Peran:
Inngest digunakan untuk:
- Menjalankan background task berbasis event (misalnya saat pengguna baru mendaftar).
- Menjadwalkan tugas otomatis, seperti:
- Pengiriman ringkasan berita harian.
- Update data saham dari API setiap jam.
- Menangani retry otomatis jika fungsi gagal dijalankan.

#### 💡 Contoh Cron Function:
```js
Copy code
export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  { cron: "0 12 * * *" }, // setiap jam 12:00 UTC
  async () => {
    console.log("Menjalankan ringkasan berita harian...");
    await sendDailyEmailToAllUsers();
  }
);
```
➤ Cron ini berjalan otomatis setiap hari untuk mengirim email ringkasan pasar saham.

## 💹 FINNHUB API (STOCK MARKET DATA)
#### 🧩 Peran:
Finnhub menyediakan data pasar saham real-time dan historis, seperti:
- Harga saham terkini (real-time quotes)
- Data perusahaan
- Berita keuangan terkini
- Indikator teknikal

#### 💡 Contoh Penggunaan API:
```js
Copy code
const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${process.env.FINNHUB_API_KEY}`);
const data = await response.json();
console.log(data);
```
➤ Data ini digunakan oleh AI (Gemini) untuk melakukan analisis dan menghasilkan rekomendasi investasi yang cerdas.

### 📬 NODEMAILER (EMAIL DELIVERY SYSTEM)
#### ⚙️ Instalasi:
```bash
npm install nodemailer
npm i --save-dev @types/nodemailer
```
#### 🔑 Konfigurasi Environment:
NODEMAILER_EMAIL=youremail@gmail.com
NODEMAILER_PASSWORD=your_app_password <br>
🔗 Buat App Password di: <br>
👉 https://myaccount.google.com/apppasswords

#### 🧩 Peran:
Nodemailer digunakan untuk mengirimkan:
 - Email verifikasi pengguna.
 - Laporan harian dari Inngest.
 - Hasil analisis AI ke pengguna yang berlangganan.

#### 💡 Contoh Penggunaan:
```
Copy code
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

await transporter.sendMail({
  from: process.env.NODEMAILER_EMAIL,
  to: user.email,
  subject: "Laporan Harian Saham",
  html: "<p>Ringkasan pasar saham hari ini...</p>"
});

```
## 🧾 Komit Penting (Commit Notes)

Beberapa commit yang tergolong penting dan perlu dicatat dalam dokumentasi proyek:

| **Commit**                     | **Deskripsi Singkat**                                                                                                  |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **Utility Functions & Core Logic** | Menambahkan fungsi-fungsi inti dan utilitas untuk mengatur logika AI, data pengguna, serta event utama aplikasi.     |
| **Inngest Integration**         | Menyambungkan sistem event & cron ke dalam aplikasi utama untuk menjalankan tugas terjadwal secara otomatis.          |
| **Nodemailer Setup**            | Mengatur sistem pengiriman email beserta konfigurasi environment agar mendukung pengiriman notifikasi dinamis.        |
| **AI Prompt Personalization**   | Menambahkan prompt dinamis untuk AI agar dapat menghasilkan output yang dipersonalisasi berdasarkan profil pengguna. |
| **Database Query Optimization** | Mengoptimalkan query MongoDB menggunakan projection dan filter yang efisien untuk meningkatkan performa aplikasi.    |

#### 🧭 ALUR KERJA SISTEM
- User mendaftar → data disimpan di MongoDB.
- Inngest memicu event user/created → fungsi AI menulis pesan sambutan lewat email (Nodemailer).
- Setiap hari (Cron) → Inngest menjalankan tugas harian untuk mengambil data saham dari Finnhub.
- Gemini AI menganalisis data dan membuat laporan berbahasa Indonesia.
- Nodemailer mengirim laporan ke semua pengguna aktif.

#### 🚀 TUJUAN UTAMA
- Menciptakan sistem otomatis, cerdas, dan aman untuk:
- Analisis saham harian berbasis AI.
- Notifikasi dan laporan email real-time.
- Pengelolaan pengguna terintegrasi.

---
