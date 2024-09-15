// Simulasi data login (username dan password yang benar)
const correctUsername = "admin";
const correctPassword = "admin";

// Referensi elemen HTML
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout");
const submitBtn = document.getElementById("login");
const wadah1 = document.querySelector(".wadah.satu");
const wadah2 = document.querySelector(".wadah.dua");

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
      logout();
    }
  }
}

// cek saat refresh
window.addEventListener("load", () => {
  loading();
  checkLoginTime();
  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");
  if (storedUsername && storedPassword) {
    // Jika sudah login
    wadah1.style.display = "none";
    wadah2.style.display = "flex";
  } else {
    // Jika belum login, tampilkan form login
    wadah1.style.display = "flex";
    wadah2.style.display = "none";
  }
});

// Fungsi untuk menampilkan pesan selamat datang
function showWelcomeMessage() {
  wadah1.style.display = "none";
  wadah2.style.display = "flex";
}

// proses login
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const peringatan = document.querySelector(".peringatan");

  // Validasi jika username dan password kosong
  if (username === "") {
    usernameInput.setCustomValidity("Username harus diisi!");
    usernameInput.reportValidity(); // Memunculkan pesan validasi
  } else if (username !== "" && password === "") {
    usernameInput.setCustomValidity(""); // Hilangkan pesan error username
    passwordInput.setCustomValidity("Password harus diisi!");
    passwordInput.reportValidity(); // Memunculkan pesan validasi untuk password
  } else if (username === correctUsername && password === correctPassword) {
    // Simpan username ke localStorage jika login berhasil
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    // Simpan timestamp saat login
    const loginTimestamp = new Date().getTime();
    localStorage.setItem("loginTimestamp", loginTimestamp);
    showWelcomeMessage();
  } else {
    // Tampilkan peringatan jika username atau password salah
    peringatan.classList.add("active");
  }

  setTimeout(() => {
    document.querySelector(".peringatan").classList.remove("active");
  }, 2000);
});

function logout() {
  // Hapus username dari localStorage
  localStorage.removeItem("username");
  localStorage.removeItem("password");
  // Tampilkan form login lagi
  wadah1.style.display = "flex";
  wadah2.style.display = "none";
  localStorage.removeItem("loginTimestamp"); // Hapus juga timestamp login

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});
