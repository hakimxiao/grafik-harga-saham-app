"use client"
// 📌 "use client" adalah directive dari Next.js (React Server Components)
// Artinya file ini akan dijalankan di sisi *client/browser* (bukan di server).
// Ini wajib kalau kita menggunakan React Hooks seperti useEffect atau useRef.

import { useEffect, useRef } from "react";
// 📚 Import dua Hook dari React:
// - useRef → untuk membuat referensi ke elemen DOM (misalnya <div>)
// - useEffect → untuk menjalankan kode setelah komponen dirender

/**
 * 🧩 Custom Hook: useTradingViewWidget
 * -----------------------------------
 * Hook ini digunakan untuk memuat (embed) widget TradingView secara dinamis.
 * Dengan hook ini, kamu bisa menampilkan grafik, heatmap, atau data pasar
 * dari TradingView hanya dengan memanggil satu fungsi sederhana.
 *
 * @param scriptUrl - URL dari scripts TradingView (biasanya dari CDN TradingView)
 * @param config - Objek konfigurasi untuk menentukan jenis widget dan pengaturannya
 * @param height - Tinggi widget dalam pixel (default = 600)
 * @returns containerRef - referensi ke elemen <div> yang akan diisi widget
 */
const useTradingViewWidget = (
    scriptUrl: string,
    config: Record<string, unknown>,
    height = 600
) => {

    // 🪞 useRef digunakan untuk "menyimpan referensi" ke elemen HTML <div>
    // Ini seperti membuat "pegangan" agar React bisa tahu elemen mana yang mau dimanipulasi.
    // Nilai awalnya null karena belum terhubung ke elemen manapun.
    const containerRef = useRef<HTMLDivElement | null>(null);

    // ⚙️ useEffect dijalankan setelah render pertama (dan setiap kali dependensi berubah)
    // Dependensi-nya adalah [scriptUrl, config, height]
    // Artinya efek ini akan dijalankan ulang hanya jika salah satu dari tiga nilai itu berubah.
    useEffect(() => {

        // 🔒 Jika ref belum terhubung ke elemen <div>, hentikan eksekusi
        if (!containerRef.current) return;

        // 🔁 Cegah scripts diload dua kali (karena TradingView bisa error kalau dimuat berulang)
        // Jadi kalau elemen sudah punya tanda `data-loaded`, fungsi langsung berhenti.
        if (containerRef.current.dataset.loaded) return;

        // 🧱 Isi awal elemen container dengan div khusus untuk widget TradingView
        // TradingView membutuhkan elemen <div> dengan class tertentu.
        containerRef.current.innerHTML = `
          <div 
              class="tradingview-widget-container__widget" 
              style="width: 100%; height: ${height}px;">
          </div>
      `;

        // 📜 Membuat elemen <scripts> baru secara dinamis
        // TradingView menggunakan scripts embed, jadi kita buat manual lewat JavaScript
        const script = document.createElement("script");

        // URL scripts TradingView, misalnya: "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
        script.src = scriptUrl;

        // Jalankan scripts secara asynchronous agar tidak menghambat rendering halaman
        script.async = true;

        // 🧩 Isi scripts dengan konfigurasi TradingView dalam format JSON string
        // Misalnya config berisi pengaturan: colorTheme, locale, symbol, dll.
        script.innerHTML = JSON.stringify(config);

        // 📥 Tambahkan scripts yang sudah disiapkan ke dalam container <div>
        // Setelah ini, TradingView otomatis akan memproses dan menampilkan grafiknya
        containerRef.current.appendChild(script);

        // 🚩 Tandai elemen sudah dimuat agar tidak di-load dua kali
        containerRef.current.dataset.loaded = "true";

        // ♻️ Fungsi "cleanup" akan dijalankan ketika komponen dihapus (unmount)
        // Ini penting untuk mencegah duplikasi widget atau memory leak
        return () => {
            if (containerRef.current) {
                // Hapus isi HTML-nya (bersihkan widget)
                containerRef.current.innerHTML = "";

                // Hapus penanda "data-loaded" agar bisa digunakan ulang
                delete containerRef.current.dataset.loaded;
            }
        }

        // 🔄 Dependensi useEffect: dijalankan ulang hanya jika salah satu nilai ini berubah
    }, [scriptUrl, config, height]);

    // 🔚 Kembalikan referensi container ke komponen yang memanggil hook ini
    // Supaya bisa dipasangkan langsung ke elemen <div> tempat widget akan dirender.
    return containerRef;
}

export default useTradingViewWidget;
// 🚀 Hook ini bisa digunakan di komponen mana pun seperti berikut:
//
// const container = useTradingViewWidget(scriptUrl, config);
// return <div ref={container}></div>;
//
// Dengan begitu, TradingView akan otomatis dimuat di dalam <div> tersebut.
