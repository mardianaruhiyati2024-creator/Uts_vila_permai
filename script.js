// ======================================
// DATA VILLA PERMAI
// ======================================

const daftarVilla = [
    {
        id: 1,
        nama: "Villa Melati",
        lokasi: "Puncak, Bogor",
        harga: 750000,
        kapasitas: 4,
        fasilitas: "2 Kamar Tidur, WiFi, Kolam Renang"
    },
    {
        id: 2,
        nama: "Villa Anggrek",
        lokasi: "Cisarua, Bogor",
        harga: 1000000,
        kapasitas: 6,
        fasilitas: "3 Kamar Tidur, WiFi, Dapur"
    },
    {
        id: 3,
        nama: "Villa Mawar",
        lokasi: "Cipanas, Bogor",
        harga: 1500000,
        kapasitas: 10,
        fasilitas: "4 Kamar Tidur, Kolam Renang, Balkon"
    }
];


// ======================================
// MENGAMBIL ELEMEN HTML
// ======================================

const villaContainer = document.getElementById("villaContainer");
const pilihanVilla = document.getElementById("pilihanVilla");
const searchVilla = document.getElementById("searchVilla");

const bookingForm = document.getElementById("bookingForm");
const namaTamu = document.getElementById("namaTamu");
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const jumlahTamu = document.getElementById("jumlahTamu");

const cekKetersediaan = document.getElementById("cekKetersediaan");
const hasilPerhitungan = document.getElementById("hasilPerhitungan");
const pesanError = document.getElementById("pesanError");
const daftarPesanan = document.getElementById("daftarPesanan");


// ======================================
// FORMAT RUPIAH
// ======================================

function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}


// ======================================
// MENAMPILKAN KARTU VILA
// ======================================

function tampilkanVilla(dataVilla = daftarVilla) {

    villaContainer.innerHTML = "";

    dataVilla.forEach(villa => {

        const card = document.createElement("div");

        card.className = "villa-card";

        card.innerHTML = `
            <h3>${villa.nama}</h3>

            <p>Lokasi: ${villa.lokasi}</p>

            <p>Kapasitas: ${villa.kapasitas} Orang</p>

            <p>Fasilitas: ${villa.fasilitas}</p>

            <p class="villa-card__price">
                ${formatRupiah(villa.harga)} / malam
            </p>

            <span class="villa-card__status">
                Tersedia
            </span>

            <br><br>

            <button onclick="pilihVilla(${villa.id})">
                Pilih Vila
            </button>
        `;

        villaContainer.appendChild(card);

    });

}


// ======================================
// PILIH UNIT VILA
// ======================================

function isiPilihanVilla() {

    daftarVilla.forEach(villa => {

        const option = document.createElement("option");

        option.value = villa.id;

        option.textContent =
            `${villa.nama} - ${formatRupiah(villa.harga)}`;

        pilihanVilla.appendChild(option);

    });

}


function pilihVilla(id) {

    pilihanVilla.value = id;

    document.getElementById("pemesanan")
        .scrollIntoView({ behavior: "smooth" });

}


// ======================================
// FITUR PENCARIAN VILA
// ======================================

searchVilla.addEventListener("input", function () {

    const keyword = this.value.toLowerCase();

    const hasil = daftarVilla.filter(villa => {

        return villa.nama.toLowerCase().includes(keyword) ||
               villa.lokasi.toLowerCase().includes(keyword);

    });

    tampilkanVilla(hasil);

});


// ======================================
// MENGHITUNG JUMLAH MALAM
// ======================================

function hitungMalam() {

    const masuk = new Date(checkIn.value);
    const keluar = new Date(checkOut.value);

    const selisih = keluar - masuk;

    return selisih / (1000 * 60 * 60 * 24);

}


// ======================================
// MENGAMBIL DATA PEMESANAN
// ======================================

function ambilPesanan() {

    return JSON.parse(
        localStorage.getItem("dataPesananVilla")
    ) || [];

}


// ======================================
// CEK KETERSEDIAAN VILA
// ======================================

function villaTersedia(idVilla, tanggalMasuk, tanggalKeluar) {

    const pesanan = ambilPesanan();

    return !pesanan.some(item => {

        if (Number(item.idVilla) !== Number(idVilla)) {
            return false;
        }

        return tanggalMasuk < item.checkOut &&
               tanggalKeluar > item.checkIn;

    });

}


// ======================================
// VALIDASI FORMULIR
// ======================================

function validasiForm() {

    if (namaTamu.value.trim() === "") {
        return "Nama tamu wajib diisi!";
    }

    if (!checkIn.value || !checkOut.value) {
        return "Tanggal check-in dan check-out wajib diisi!";
    }

    if (pilihanVilla.value === "") {
        return "Silakan pilih unit vila!";
    }

    if (Number(jumlahTamu.value) < 1) {
        return "Jumlah tamu minimal 1 orang!";
    }

    const malam = hitungMalam();

    if (malam <= 0) {
        return "Tanggal check-out harus setelah check-in!";
    }

    const villa = daftarVilla.find(
        item => item.id === Number(pilihanVilla.value)
    );

    if (Number(jumlahTamu.value) > villa.kapasitas) {
        return `Kapasitas maksimal ${villa.kapasitas} orang!`;
    }

    return "";

}


// ======================================
// MENGHITUNG TOTAL BIAYA
// ======================================

function hitungBiaya() {

    const villa = daftarVilla.find(
        item => item.id === Number(pilihanVilla.value)
    );

    if (!villa) return 0;

    const malam = hitungMalam();

    return villa.harga * malam;

}


// ======================================
// TOMBOL CEK KETERSEDIAAN
// ======================================

cekKetersediaan.addEventListener("click", function () {

    pesanError.textContent = "";

    const error = validasiForm();

    if (error) {
        pesanError.textContent = error;
        return;
    }

    const tersedia = villaTersedia(
        pilihanVilla.value,
        checkIn.value,
        checkOut.value
    );

    if (!tersedia) {

        pesanError.textContent =
            "Maaf, vila sudah dipesan pada tanggal tersebut!";

        return;

    }

    const total = hitungBiaya();

    hasilPerhitungan.innerHTML = `
        <h3>Vila Tersedia!</h3>

        <p>Nama: ${namaTamu.value}</p>

        <p>Jumlah malam: ${hitungMalam()} malam</p>

        <p>Total biaya:
            <strong>${formatRupiah(total)}</strong>
        </p>
    `;

});


// ======================================
// PROSES PEMESANAN
// ======================================

bookingForm.addEventListener("submit", function (event) {

    event.preventDefault();

    pesanError.textContent = "";

    const error = validasiForm();

    if (error) {

        pesanError.textContent = error;

        return;

    }

    const tersedia = villaTersedia(
        pilihanVilla.value,
        checkIn.value,
        checkOut.value
    );

    if (!tersedia) {

        pesanError.textContent =
            "Vila tidak tersedia pada tanggal tersebut!";

        return;

    }

    const villa = daftarVilla.find(
        item => item.id === Number(pilihanVilla.value)
    );

    const pesananBaru = {

        id: Date.now(),

        nama: namaTamu.value.trim(),

        idVilla: villa.id,

        namaVilla: villa.nama,

        checkIn: checkIn.value,

        checkOut: checkOut.value,

        jumlahTamu: Number(jumlahTamu.value),

        totalBiaya: hitungBiaya()

    };


    const semuaPesanan = ambilPesanan();

    semuaPesanan.push(pesananBaru);


    localStorage.setItem(
        "dataPesananVilla",
        JSON.stringify(semuaPesanan)
    );


    hasilPerhitungan.innerHTML = `
        <h3>Pemesanan Berhasil!</h3>

        <p>Nama: ${pesananBaru.nama}</p>

        <p>Villa: ${pesananBaru.namaVilla}</p>

        <p>Check-in: ${pesananBaru.checkIn}</p>

        <p>Check-out: ${pesananBaru.checkOut}</p>

        <p>Total pembayaran:
            <strong>${formatRupiah(pesananBaru.totalBiaya)}</strong>
        </p>
    `;


    bookingForm.reset();

    tampilkanPesanan();

});


// ======================================
// MENAMPILKAN RIWAYAT PEMESANAN
// ======================================

function tampilkanPesanan() {

    const pesanan = ambilPesanan();

    daftarPesanan.innerHTML = `
        <h3>Riwayat Pemesanan</h3>
    `;

    if (pesanan.length === 0) {

        daftarPesanan.innerHTML +=
            "<p>Belum ada pemesanan.</p>";

        return;

    }

    pesanan.forEach(item => {

        const card = document.createElement("div");

        card.className = "result-box";

        const nama = document.createElement("p");
        nama.textContent = "Nama: " + item.nama;

        const villa = document.createElement("p");
        villa.textContent = "Villa: " + item.namaVilla;

        const tanggal = document.createElement("p");
        tanggal.textContent =
            "Tanggal: " + item.checkIn + " sampai " + item.checkOut;

        const biaya = document.createElement("p");
        biaya.textContent =
            "Total: " + formatRupiah(item.totalBiaya);

        card.append(nama, villa, tanggal, biaya);

        daftarPesanan.appendChild(card);

    });

}


// ======================================
// MENJALANKAN PROGRAM
// ======================================

tampilkanVilla();

isiPilihanVilla();

tampilkanPesanan();