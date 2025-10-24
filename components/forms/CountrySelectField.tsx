/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// Import React dan tools
import { useState, useMemo, useEffect } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';

// Import komponen UI (shadcn)
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import library negara dan bendera
import countryList from 'react-select-country-list';
import Flag from 'react-world-flags'; // ✅ Gunakan bendera SVG agar tampil di semua browser

// Tipe props untuk komponen utama
type CountrySelectProps = {
    name: string;
    label: string;
    control: Control<any>;
    error?: FieldError;
    required?: boolean;
};

// Komponen untuk menampilkan dropdown negara
const CountrySelect = ({
   value,
   onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => {
    // State untuk buka/tutup dropdown
    const [open, setOpen] = useState(false);

    // Ambil daftar negara dari library
    const countries = useMemo(() => countryList().getData(), []);

    // Log data negara saat pertama kali di-load
    useEffect(() => {
        console.log('📦 Semua negara:', countries);
        console.log('🧩 Contoh data pertama:', countries[0]); // contoh objek pertama
    }, [countries]);

    // Cari negara yang sedang dipilih
    const selected = countries.find((c) => c.value === value);

    // Log negara yang sedang dipilih setiap kali berubah
    useEffect(() => {
        console.log('🎯 Negara dipilih (value):', value);
        console.log('🎌 Negara dipilih (objek lengkap):', selected);
    }, [value, selected]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {/* Tombol utama untuk memicu popover */}
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="country-select-trigger flex justify-between items-center w-full"
                >
                    {selected ? (
                        // ✅ Jika ada negara yang dipilih, tampilkan bendera + nama
                        <span className="flex items-center gap-2">
              {/* SVG Bendera */}
                            <Flag
                                code={selected.value}
                                style={{ width: 24, height: 18, borderRadius: '3px' }}
                            />
              <span>{selected.label}</span>
            </span>
                    ) : (
                        // Jika belum memilih negara
                        'Pilih negara Anda...'
                    )}
                    {/* Icon panah bawah */}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            {/* Isi dropdown */}
            <PopoverContent
                className="w-full p-0 bg-gray-800 border-gray-600"
                align="start"
            >
                <Command className="bg-gray-800 border-gray-600">
                    {/* Input pencarian negara */}
                    <CommandInput
                        placeholder="Telusuri negara..."
                        className="country-select-input"
                        onValueChange={(text) => console.log('🔎 Pencarian:', text)}
                    />
                    <CommandEmpty className="country-select-empty">
                        Tidak ada negara yang ditemukan.
                    </CommandEmpty>

                    {/* Daftar hasil */}
                    <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
                        <CommandGroup className="bg-gray-800">
                            {countries.map((country) => (
                                <CommandItem
                                    key={country.value}
                                    value={country.value}
                                    onSelect={() => {
                                        console.log('✅ Anda memilih:', country);
                                        onChange(country.value);
                                        setOpen(false);
                                    }}
                                    className="country-select-item flex items-center gap-2"
                                >
                                    {/* Tanda centang */}
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4 text-yellow-500',
                                            value === country.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {/* SVG Bendera + Nama Negara */}
                                    <Flag
                                        code={country.value}
                                        style={{ width: 24, height: 18, borderRadius: '3px' }}
                                    />
                                    <span className="text-sm">{country.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

// Komponen utama untuk field react-hook-form
export const CountrySelectField = ({
                                       name,
                                       label,
                                       control,
                                       error,
                                       required = false,
                                   }: CountrySelectProps) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="form-label">
                {label}
            </Label>

            {/* Controller dari react-hook-form */}
            <Controller
                name={name}
                control={control}
                rules={{
                    required: required ? `Silakan pilih ${label.toLowerCase()}` : false,
                }}
                render={({ field }) => (
                    <CountrySelect value={field.value} onChange={field.onChange} />
                )}
            />

            {/* Jika ada error validasi */}
            {error && <p className="text-sm text-red-500">{error.message}</p>}

            {/* Catatan tambahan */}
            <p className="text-xs text-gray-500">
                Membantu kami menampilkan data pasar dan berita yang relevan bagi Anda.
            </p>
        </div>
    );
};
