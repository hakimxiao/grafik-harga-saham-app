# 🤖 AI STOCK MARKET APP

---

## 🧍 Account Information

### 🧠 AI STUDIO (GEMINI)  
-- Pakai akun **Ucok Pakpahan**

### 🍃 MONGODB ATLAS  
-- Pakai akun **fhkim**

---

## ⚙️ INNGEST CLI COMMAND  
-- Jalankan perintah berikut untuk menjalankan Inngest secara lokal:
```bash
npx inngest-cli@latest dev
````

---

## 📬 NODEMAILER INSTALLATION

-- Install Nodemailer dan tipe datanya:

```bash
npm install nodemailer
npm i --save-dev @types/nodemailer
```

---

## 🔑 NODEMAILER REQUIREMENT

Pastikan kamu sudah menyiapkan kredensial berikut:

```
NODEMAILER_EMAIL=   by Google account (aktifkan 2-step verification)
NODEMAILER_PASSWORD=    by creating an App Password di link berikut:
```

👉 [https://myaccount.google.com/apppasswords?pli=1](https://myaccount.google.com/apppasswords?pli=1)

---

## 🧾 INFORMATION

### INFO FOR : 1***

### 📍 Konteks Umum

Kode ini menggunakan **MongoDB Native Driver** (melalui koneksi Mongoose) untuk mengambil data dari koleksi (collection) bernama **`users`**.

Urutan proses:

1. Terkoneksi ke database (`connectToDatabase()`).
2. Ambil referensi ke database aktif (`mongoose.connection.db`).
3. Akses koleksi `users`.
4. Lakukan pencarian dengan `.find(...)`.
5. Hasilnya dikonversi ke array dengan `.toArray()` agar bisa diproses lebih lanjut di JavaScript.

---

### 💡 Bagian Penting: `.find(filter, options)`

Fungsi `.find()` di MongoDB menerima dua parameter utama:

```js
.find(filter, options)
```

1. **`filter`** → menentukan *kriteria dokumen mana yang mau diambil*.
2. **`options`** → menentukan *apa yang mau ditampilkan atau disembunyikan* dari hasil pencarian.

---

### 🔍 Penjelasan Detail

#### 1️⃣ Filter (parameter pertama)

```js
{ email: { $exists: true, $ne: null } }
```

Artinya:

* `email` harus **ada** di dokumen (`$exists: true`).
* dan **tidak boleh bernilai null** (`$ne: null` → *not equal to null*).

👉 Query ini akan mengambil **semua user yang memiliki email valid (tidak kosong/null)**.

---

#### 2️⃣ Options / Projection (parameter kedua)

```js
{ projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
```

Artinya:

* Hanya kolom (field) tertentu yang akan ditampilkan dalam hasil query.
* Angka `1` artinya **tampilkan field ini**.
  (Kalau `0`, berarti **sembunyikan field ini**.)

Jadi hasil yang diambil hanya berisi:

```js
{
  _id,
  id,
  email,
  name,
  country
}
```

Field lain di dokumen `users` tidak akan ikut dikembalikan.

---

### 🧠 Kesimpulan Singkat

Kode ini artinya:

> Ambil semua dokumen dari koleksi `users` yang memiliki field `email` (dan nilainya bukan `null`), lalu tampilkan hanya field `_id`, `id`, `email`, `name`, dan `country`.

---

### 📦 Contoh Hasil (`console.log(users)`)

Misalnya di database ada data seperti ini:

```js
{
  _id: ObjectId("..."),
  id: 1,
  email: "abbu@example.com",
  name: "Abbu Solihin",
  country: "Indonesia",
  password: "123456",    // field ini tidak ditampilkan
  role: "admin"          // field ini juga tidak ditampilkan
}
```

Maka hasil `.find()` di atas hanya mengembalikan:

```js
[
  {
    _id: ObjectId("..."),
    id: 1,
    email: "abbu@example.com",
    name: "Abbu Solihin",
    country: "Indonesia"
  }
]
```

---

✨ **Catatan:**
Jika hanya ingin mengambil satu dokumen, gunakan `.findOne(filter, options)` tanpa `.toArray()`.
