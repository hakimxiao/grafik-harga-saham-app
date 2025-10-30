"use client";

import {useCallback, useRef} from "react";

// INFO : Digunakan untuk menahan sistem melakukkan pencarian langsung saat user mengetik, tapi setelah
//      user tidak melanjutkan ngetik dalam rentan di tentukan maka baru pencarian dilakukan.
export const useDebounce = (callback: () => void, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback(() => {
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(callback, delay);
    }, [callback, delay])
}

