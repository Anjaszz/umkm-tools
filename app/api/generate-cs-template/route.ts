import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { type, tone, customerName, context } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    let specificInstructions = "";

    switch (type) {
        case "greeting":
            specificInstructions = `
            - Tujuan: Menyapa pelanggan baru dengan struktur yang jelas dan informatif.
            - Nama Toko: ${customerName || "[Nama Toko]"} 
            - Detail Info (Jam Ops/Desc): ${context || "-"}
            - Instruksi Khusus: 
              1. Mulai dengan "Selamat Datang di [Nama Toko]!"
              2. Jelaskan ketersediaan barang (misal: "Barang ready stok...").
              3. Tampilkan Jam Operasional dengan layout baris per baris yang rapi (seperti daftar).
              4. Tutup dengan info pengiriman atau kalimat penutup ramah.
              5. JANGAN gunakan paragraf panjang. Gunakan enter/newline antar poin agar mudah dibaca.
            `;
            break;
        case "complaint":
            specificInstructions = `
            - Tujuan: Menanggapi komplain pelanggan dengan empati dan struktur rapi wajar tidak kaku.
            - Nama Customer: ${customerName || "Kak"}
            - Masalah: ${context || "-"}
            - Instruksi Khusus: 
              1. Paragraf 1: Minta maaf dengan tulus dan validasi perasaan pelanggan.
              2. Paragraf 2: Jelaskan solusi atau langkah investigasi yang akan diambil.
              3. Paragraf 3: Penutup yang meyakinkan, tawarkan bantuan lanjut, dan kasih emoji maaf/sedih yang sopan.
              4. Gunakan enter/newline antar paragraf agar tidak menumpuk.
            `;
            break;
        case "shipping":
             specificInstructions = `
            - Tujuan: Memberikan informasi pengiriman atau nomor resi dengan jelas.
            - Nama Customer: ${customerName || "Kak"}
            - Detail Pengiriman/Resi: ${context || "-"}
            - Instruksi Khusus: 
              1. Sapa customer dengan ramah.
              2. Berikan info status paket atau Nomor Resi di baris terpisah agar mudah dicopy.
              3. Jelaskan estimasi waktu sampai jika memungkinkan.
              4. Tutup dengan ucapan terima kasih telah menunggu.
              5. Gunakan format list atau enter antar poin penting.
            `;
            break;
        case "stock":
             specificInstructions = `
            - Tujuan: Menginfokan ketersediaan stok produk.
            - Nama Customer: ${customerName || "Kak"}
            - Detail Produk/Warna: ${context || "-"}
            - Instruksi Khusus: 
              1. Jelaskan status stok (Ready/Habis) di awal.
              2. Jika ada opsi alternatif (warna/size lain), tulis di baris baru.
              3. Arahkan customer untuk checkout atau konfirmasi pilihan.
              4. Pesan harus singkat, padat, tapi tetap terstruktur baris per baris.
            `;
            break;
        case "review":
             specificInstructions = `
            - Tujuan: Meminta ulasan/review bintang 5 dari pelanggan.
            - Nama Customer: ${customerName || "Kak"}
            - Produk yang dibeli: ${context || "-"}
            - Instruksi Khusus: 
              1. Ucapkan terima kasih atas pembelian [Nama Produk].
              2. Minta kesediaan waktu sebentar untuk memberikan ulasan/bintang 5 di baris baru.
              3. Doakan customer (misal: "Semoga awet ya kak!").
              4. JANGAN memaksa, gunakan bahasa yang sangat sopan dan humble.
            `;
            break;
        case "followup":
             specificInstructions = `
            - Tujuan: Follow-up pesanan yang belum dibayar atau dikonfirmasi.
            - Nama Customer: ${customerName || "Kak"}
            - Detail Pesanan: ${context || "-"}
            - Instruksi Khusus: 
              1. Ingatkan customer tentang pesanan yang tertunda.
              2. Tanyakan apakah ada kendala pembayaran di baris baru.
              3. Tawarkan bantuan jika customer bingung caranya.
              4. Pastikan tidak terdengar seperti menagih hutang, tapi 'caring' / peduli.
            `;
            break;
        default:
             specificInstructions = `
            - Tujuan: Membalas pesan customer service umum.
            - Nama Customer: ${customerName || "Kak"}
            - Konteks: ${context || "-"}
            `;
            break;
    }

    const prompt = `
Bertindaklah sebagai Customer Service toko online yang profesional.
Buatkan pesan CS satu paragraf atau list pendek yang rapi.

Detail Situasi:
${specificInstructions}

- Nada Bicara: ${tone || "Ramah dan Profesional"}
- Bahasa: Indonesia (Natural, luwes, dan sopan)

Instruksi PENTING:
1. HANYA tulis isi pesan akhir. Jangan ada teks pembuka seperti "Tentu, ini drafnya...".
2. Sesuaikan sapaan dengan Nama Customer (atau Nama Toko jika tipe greeting).
3. Gunakan emoji secukupnya agar pesan terasa hangat (kecuali tone formal).
4. Pastikan pesan solutif dan menutup percakapan dengan baik.
5. WAJIB bagilah pesan menjadi beberapa paragraf pendek atau poin-poin. JANGAN kirim satu blok teks panjang tanpa spasi (newline).
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
          { text: prompt }
      ],
    });

    return NextResponse.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error("Error generating CS template:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate template",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
