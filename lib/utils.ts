import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInMs = now - timestamp * 1000; // Ubah ke milidetik
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInHours > 24) {
        const days = Math.floor(diffInHours / 24);
        return `${days} hari${days > 1 ? '' : ''} yang lalu`;
    } else if (diffInHours >= 1) {
        return `${diffInHours} jam${diffInHours > 1 ? '' : ''} yang lalu`;
    } else {
        return `${diffInMinutes} menit${diffInMinutes > 1 ? '' : ''} yang lalu`;
    }
};

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Format string seperti "$3.10T", "$900.00B", "$25.00M" atau "$999,999.99"
export function formatMarketCapValue(marketCapUsd: number): string {
    if (!Number.isFinite(marketCapUsd) || marketCapUsd <= 0) return 'Tidak tersedia';

    if (marketCapUsd >= 1e12) return `$${(marketCapUsd / 1e12).toFixed(2)}T`; // Triliun
    if (marketCapUsd >= 1e9) return `$${(marketCapUsd / 1e9).toFixed(2)}B`; // Miliar
    if (marketCapUsd >= 1e6) return `$${(marketCapUsd / 1e6).toFixed(2)}M`; // Juta
    return `$${marketCapUsd.toFixed(2)}`; // Di bawah satu juta, tampilkan nilai penuh dalam USD
}

export const getDateRange = (days: number) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);
    return {
        to: toDate.toISOString().split('T')[0],
        from: fromDate.toISOString().split('T')[0],
    };
};

// Ambil rentang tanggal hari ini (dari hari ini sampai hari ini)
export const getTodayDateRange = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return {
        to: todayString,
        from: todayString,
    };
};

// Hitung jumlah berita per simbol berdasarkan ukuran watchlist
export const calculateNewsDistribution = (symbolsCount: number) => {
    let itemsPerSymbol: number;
    let targetNewsCount = 6;

    if (symbolsCount < 3) {
        itemsPerSymbol = 3; // Lebih sedikit simbol, lebih banyak berita per simbol
    } else if (symbolsCount === 3) {
        itemsPerSymbol = 2; // Tepat 3 simbol, masing-masing 2 berita = total 6
    } else {
        itemsPerSymbol = 1; // Banyak simbol, 1 berita per simbol
        targetNewsCount = 6; // Jangan melebihi total 6
    }

    return { itemsPerSymbol, targetNewsCount };
};

// Periksa apakah artikel memiliki semua field yang diperlukan
export const validateArticle = (article: RawNewsArticle) =>
    article.headline && article.summary && article.url && article.datetime;

// Dapatkan tanggal hari ini dalam format YYYY-MM-DD
export const getTodayString = () => new Date().toISOString().split('T')[0];

export const formatArticle = (
    article: RawNewsArticle,
    isCompanyNews: boolean,
    symbol?: string,
    index: number = 0
) => ({
    id: isCompanyNews ? Date.now() + Math.random() : article.id + index,
    headline: article.headline!.trim(),
    summary:
        article.summary!.trim().substring(0, isCompanyNews ? 200 : 150) + '...',
    source: article.source || (isCompanyNews ? 'Berita Perusahaan' : 'Berita Pasar'),
    url: article.url!,
    datetime: article.datetime!,
    image: article.image || '',
    category: isCompanyNews ? 'perusahaan' : article.category || 'umum',
    related: isCompanyNews ? symbol! : article.related || '',
});

export const formatChangePercent = (changePercent?: number) => {
    if (!changePercent) return '';
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
};

export const getChangeColorClass = (changePercent?: number) => {
    if (!changePercent) return 'text-gray-400';
    return changePercent > 0 ? 'text-green-500' : 'text-red-500';
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(price);
};

export const formatDateToday = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
});

export const getAlertText = (alert: Alert) => {
    const condition = alert.alertType === 'upper' ? '>' : '<';
    return `Harga ${condition} ${formatPrice(alert.threshold)}`;
};

export const getFormattedTodayDate = () => new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
});
