function loading() {
  const loadingBar = document.querySelector(".loading");
  loadingBar.style.width = "100%";
  loadingBar.style.transition = "width 1s";
  setTimeout(() => {
    loadingBar.style.width = "0%";
    loadingBar.style.removeProperty("transition");
  }, 1000);
}

// Ambil data dari localStorage
const dataMahasiswa = JSON.parse(localStorage.getItem("dataMahasiswa")) || [];

// Elemen untuk menampilkan dokumentasi
const dokumentasiIPKDiv = document.getElementById("dokumentasiIPK");

// Waktu logout otomatis dalam milidetik (24 jam = 24 * 60 * 60 * 1000 milidetik)
const logoutTime = 24 * 60 * 60 * 1000; // 24 jam
const currentTime = new Date().getTime();

// Fungsi untuk menghitung waktu login
function checkLoginTime() {
  const loginTimestamp = localStorage.getItem("loginTimestamp");

  if (loginTimestamp) {
    const timeElapsed = currentTime - loginTimestamp;

    if (timeElapsed > logoutTime) {
      document.getElementById("home").click();
    }
  }
}

// Tampilkan data dokumentasi jika ada
if (dataMahasiswa.length > 0) {
  dataMahasiswa.forEach((data, index) => {
    let tabelDokumentasi = `
      <div class="data ke${index + 1}">
      <h2>Nama Mahasiswa: ${data.nama}</h2>
      <table>
        <thead>
          <tr>
              <th>No</th>
              <th>Nama Mata Kuliah</th>
              <th>SKS</th>
              <th>Nilai</th>
              <th>Kriteria</th>
          </tr>
          </thead>
          `;

    // Loop untuk setiap mata kuliah
    data.mataKuliahData.forEach((mk, mkIndex) => {
      tabelDokumentasi += `
        <tbody>
          <tr>
              <td>${mkIndex + 1}</td>
              <td>${mk.namaMK}</td>
              <td>${mk.sks}</td>
              <td>${mk.nilai}</td>
              <td>${mk.kriteria}</td>
          </tr>
          </tbody>
          `;
    });

    tabelDokumentasi += `</table>
    <p>Semester: ${data.semester}&emsp; IPK: <span class="${getIPKClass(
      data.ipk
    )}">${data.ipk.toFixed(2)}</span></p>
    </div>`;
    // Tambahkan setiap tabel ke halaman
    dokumentasiIPKDiv.innerHTML += tabelDokumentasi;
  });
} else {
  // Jika tidak ada data, tampilkan pesan
  dokumentasiIPKDiv.innerHTML = `<p class="isi-kosong">Data IPK tidak tersedia, Silahkan Isi <i class="fa-regular fa-folder-open"></i></p>`;
}

// Tambahkan event listener untuk tombol hapus
document.getElementById("hapus").addEventListener("click", () => {
  if (!localStorage.getItem("dataMahasiswa")) {
    dokumentasiIPKDiv.innerHTML = `<p class="isi-kosong">Tidak ada data IPK yang dapat dihapus <i class="fa-solid fa-circle-exclamation"></i></p>`;
  } else {
    // Hapus item dari localStorage berdasarkan kunci
    localStorage.removeItem("dataMahasiswa");
    // Bersihkan tampilan data dokumentasi di halaman
    dokumentasiIPKDiv.innerHTML = `<p class="isi-kosong">Semua data IPK telah dihapus <i class="fa-regular fa-trash-can"></i></p>`;
  }
});

window.addEventListener("load", () => {
  checkLoginTime();
  loading();
});

// Fungsi untuk menentukan kelas CSS berdasarkan nilai IPK
function getIPKClass(ipk) {
  if (ipk >= 3.5) return "ipk-tinggi";
  if (ipk >= 3.0) return "ipk-sedang";
  return "ipk-rendah";
}
