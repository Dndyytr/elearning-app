// Ambil elemen-elemen penting dari halaman
const generateFieldsBtn = document.getElementById("generateFields");
const hitungIPKBtn = document.getElementById("hitungIPK");
const mataKuliahFields = document.getElementById("mataKuliahFields");
const hasilIPK = document.getElementById("hasilIPK");
const namaMahasiswaInput = document.getElementById("namaMahasiswa");
const jumlahMataKuliahInput = document.getElementById("jumlahMataKuliah");
const semesterInput = document.getElementById("semester");
const kembali = document.getElementById("kembali");
const ipkForm = document.getElementById("ipkForm");
const peringatan = document.querySelector(".peringatan");

// loading
function loading() {
  const loadingBar = document.querySelector(".loading");
  loadingBar.style.width = "100%";
  loadingBar.style.transition = "width 1s";
  setTimeout(() => {
    loadingBar.style.width = "0%";
    loadingBar.style.removeProperty("transition");
  }, 1000);
}

// Waktu logout otomatis dalam milidetik (24 jam = 24 * 60 * 60 * 1000 milidetik)
const logoutTime = 24 * 60 * 60 * 1000; // 24 jam

// Fungsi untuk menghitung waktu login
function checkLoginTime() {
  const loginTimestamp = localStorage.getItem("loginTimestamp");

  if (loginTimestamp) {
    const currentTime = new Date().getTime();
    const timeElapsed = currentTime - loginTimestamp;

    if (timeElapsed > logoutTime) {
      document.getElementById("home").click();
    }
  }
}

// Tambahkan event listener untuk tombol 'Generate Fields' dan 'Hitung IPK'
generateFieldsBtn.addEventListener("click", generateMataKuliahFields);
hitungIPKBtn.addEventListener("click", hitungIPK);

// Fungsi untuk membuat input mata kuliah berdasarkan jumlah yang diinput
function generateMataKuliahFields() {
  mataKuliahFields.classList.remove("hidden");
  const namaMahasiswa = namaMahasiswaInput.value.trim();
  // Validasi input nama mahasiswa
  if (namaMahasiswa === "") {
    peringatan.innerHTML = "Nama mahasiswa wajib diisi!";
    peringatan.classList.add("active");
    setTimeout(() => {
      peringatan.classList.remove("active");
    }, 2000);
    return;
  }

  const jumlahMataKuliah = parseInt(jumlahMataKuliahInput.value);
  // Validasi input jumlah mata kuliah
  if (!jumlahMataKuliah || jumlahMataKuliah < 1 || jumlahMataKuliah > 20) {
    peringatan.innerHTML = "Jumlah mata kuliah harus antara 1 dan 20!";
    peringatan.classList.add("active");
    setTimeout(() => {
      peringatan.classList.remove("active");
    }, 3000);
    return;
  }

  const semester = parseInt(semesterInput.value);
  // Validasi input jumlah mata kuliah
  if (!semester || semester < 1 || semester > 10) {
    peringatan.innerHTML = "Masukkan Semester Yang Valid!";
    peringatan.classList.add("active");
    setTimeout(() => {
      peringatan.classList.remove("active");
    }, 3000);
    return;
  }

  // Bersihkan elemen mataKuliahFields untuk menghindari duplikasi
  mataKuliahFields.innerHTML = "";

  // Loop untuk menghasilkan input mata kuliah
  for (let i = 0; i < jumlahMataKuliah; i++) {
    // hapus form
    ipkForm.classList.add("hidden");
    // buat isi matkul
    mataKuliahFields.innerHTML += `
            <fieldset>
                <legend>Mata Kuliah ${i + 1}</legend>
                <div class="form-group">
                    <label for="namaMK${i}">Nama Mata Kuliah:</label>
                    <input type="text" id="namaMK${i}" required>
                </div>
                <div class="form-group">
                    <label for="sksMK${i}">Jumlah SKS:</label>
                    <input type="number" id="sksMK${i}" min="1" max="6" required>
                </div>
                <div class="form-group">
                    <label for="nilaiMK${i}">Nilai:</label>
                    <select id="nilaiMK${i}" required>
                        <option value="">Pilih Nilai</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                    </select>
                </div>
            </fieldset>`;
  }

  // Tampilkan tombol hitung IPK setelah input mata kuliah dibuat
  hitungIPKBtn.classList.remove("hidden");
}

// Fungsi untuk menghitung IPK
function hitungIPK() {
  const namaMahasiswa = namaMahasiswaInput.value.trim(); // Ambil nilai nama mahasiswa di sini
  const semester = parseInt(semesterInput.value);

  const jumlahMataKuliah = parseInt(jumlahMataKuliahInput.value);
  let totalPoin = 0,
    totalSKS = 0,
    mataKuliahData = [];

  // Mulai membangun tabel hasil
  let tabelHasil =
    "<table><tr><th>Mata Kuliah</th><th>SKS</th><th>Nilai</th><th>Kriteria</th></tr>";

  for (let i = 0; i < jumlahMataKuliah; i++) {
    const namaMK = document.getElementById(`namaMK${i}`).value.trim();
    const sks = parseInt(document.getElementById(`sksMK${i}`).value);
    const nilai = document.getElementById(`nilaiMK${i}`).value;
    // Validasi input mata kuliah
    if (!namaMK || isNaN(sks) || !nilai) {
      peringatan.innerHTML = "Semua data mata kuliah harus diisi dengan benar!";
      peringatan.classList.add("active");
      setTimeout(() => {
        peringatan.classList.remove("active");
      }, 3000);
      return;
    }

    // Konversi nilai ke poin dan kriteria
    const { poin, kriteria } = konversiNilaiKePoin(nilai);
    totalPoin += poin * sks; // Hitung total poin
    totalSKS += sks; // Hitung total SKS

    // Tambahkan data ke tabel hasil
    tabelHasil += `<tr><td>${namaMK}</td><td>${sks}</td><td>${nilai}</td><td>${kriteria}</td></tr>`;
    mataKuliahData.push({ namaMK, sks, nilai, kriteria }); // Simpan data mata kuliah
  }
  tabelHasil += "</table>";

  // Hitung IPK dan tampilkan hasil
  const ipk = totalPoin / totalSKS;
  hasilIPK.innerHTML = `
      <h2>Hasil Perhitungan IPK</h2>
      <p>Nama Mahasiswa: ${namaMahasiswa}</p>
      ${tabelHasil}
      <p class="ipk-result">Semester: ${semester}&emsp;&emsp; IPK: <span class="${getIPKClass(
    ipk
  )}">${ipk.toFixed(2)}</span></p>
  `;

  // Simpan data ke localStorage
  saveData(namaMahasiswa, jumlahMataKuliah, mataKuliahData, ipk, semester);
}

// Fungsi untuk mengkonversi nilai huruf ke poin dan kriteria
function konversiNilaiKePoin(nilai) {
  const poinMapping = { A: 4, B: 3, C: 2, D: 1, E: 0 };
  const kriteriaMapping = {
    A: "Istimewa",
    B: "Baik",
    C: "Cukup",
    D: "Kurang",
    E: "Tidak Lulus",
  };
  return { poin: poinMapping[nilai], kriteria: kriteriaMapping[nilai] };
}

// Fungsi untuk menentukan kelas CSS berdasarkan nilai IPK
function getIPKClass(ipk) {
  if (ipk >= 3.5) return "ipk-tinggi";
  if (ipk >= 3.0) return "ipk-sedang";
  return "ipk-rendah";
}

// Fungsi untuk menyimpan data ke localStorage
function saveData(nama, jumlahMK, mataKuliahData, ipk, semester) {
  // Ambil data yang sudah ada di localStorage
  let dataMahasiswa = JSON.parse(localStorage.getItem("dataMahasiswa")) || [];

  // Tambahkan data baru ke array
  dataMahasiswa.push({
    nama: nama,
    jumlahMK: jumlahMK,
    mataKuliahData: mataKuliahData,
    ipk: ipk,
    semester: semester,
  });

  // Simpan array yang diperbarui ke localStorage
  localStorage.setItem("dataMahasiswa", JSON.stringify(dataMahasiswa));

  hitungIPKBtn.classList.add("hidden");
  mataKuliahFields.classList.add("hidden");
  kembali.classList.remove("hidden");
  hasilIPK.classList.remove("hidden");
}

function menu() {
  hasilIPK.classList.add("hidden");
  ipkForm.classList.remove("hidden");
  kembali.classList.add("hidden");
  clearInputsOnLoad();
}

// Fungsi untuk mengosongkan input saat halaman dimuat
function clearInputsOnLoad() {
  // Kosongkan input nama mahasiswa dan jumlah mata kuliah
  namaMahasiswaInput.value = "";
  jumlahMataKuliahInput.value = "";
  semesterInput.value = "";

  // Kosongkan input mata kuliah
  mataKuliahFields.innerHTML = "";
  hasilIPK.innerHTML = ""; // Kosongkan hasil perhitungan IPK
}

// Event listener yang dijalankan ketika halaman dimuat
window.addEventListener("load", () => {
  clearInputsOnLoad(); // Kosongkan semua
  checkLoginTime();
  loading();
});
