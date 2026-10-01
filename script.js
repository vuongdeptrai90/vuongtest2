/* ==================== ÂM THANH & GIAO DIỆN ==================== */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'click') {
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } else if (type === 'success') {
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } else if (type === 'hit') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }
}

function toggleTheme() {
  playSound('click');
  document.body.classList.toggle("theme-purple");
  let isPurple = document.body.classList.contains("theme-purple");
  localStorage.setItem("theme", isPurple ? "purple" : "cyan");
}
if(localStorage.getItem("theme") === "purple") {
  document.body.classList.add("theme-purple");
}

let totalVisits = Number(localStorage.getItem("totalVisits")) || 120;
totalVisits++;
localStorage.setItem("totalVisits", totalVisits);

if (localStorage.getItem("userSpins") === null) {
  localStorage.setItem("userSpins", "1");
}

function updateSpinUI() {
  let spins = Number(localStorage.getItem("userSpins")) || 0;
  let userSpinsEl = document.getElementById("userSpins");
  if(userSpinsEl) userSpinsEl.innerText = spins;
}

window.addEventListener("DOMContentLoaded", () => {
  let totalVisitsEl = document.getElementById("totalVisits");
  if(totalVisitsEl) totalVisitsEl.innerText = totalVisits;
  updateSpinUI();
  checkDailyCheckinStatus();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("verify") === "link4m") {
    let currentSpins = Number(localStorage.getItem("userSpins")) || 0;
    localStorage.setItem("userSpins", currentSpins + 3);
    updateSpinUI();
    showToast("🎉 Xác thực vượt link thành công! Nhận thêm 3 lượt!");
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

function redirectToGetLink() {
  playSound('click');
  showToast("🔗 Đang chuyển hướng sang trang vượt link...");
  window.location.href = "https://link4m.org/401ScXi6";
}

function checkDailyCheckinStatus() {
  let lastCheckin = localStorage.getItem("lastCheckinDate");
  let today = new Date().toDateString();
  if (lastCheckin === today) {
    let checkinText = document.getElementById("checkinText");
    let checkinBtn = document.getElementById("checkinBtn");
    if(checkinText) checkinText.innerText = "✅ Hôm nay bạn đã điểm danh nhận quà rồi!";
    if(checkinBtn) checkinBtn.style.display = "none";
  }
}

function claimDailyCheckin() {
  playSound('success');
  let today = new Date().toDateString();
  localStorage.setItem("lastCheckinDate", today);
  
  let currentSpins = Number(localStorage.getItem("userSpins")) || 0;
  localStorage.setItem("userSpins", currentSpins + 2);
  updateSpinUI();
  
  showToast("🎉 Điểm danh thành công! Bạn nhận được thêm 2 lượt!");
  checkDailyCheckinStatus();
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if(!toast) return;
  toast.innerText = message;
  toast.className = "show";
  setTimeout(function(){ 
    toast.className = toast.className.replace("show", ""); 
  }, 2500);
}

function switchTab(evt, tabId) {
  playSound('click');
  let contents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < contents.length; i++) {
    contents[i].classList.remove("active");
  }

  let buttons = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
}

/* ==================== RANDOM ACC ==================== */
const defaultAccounts = [
  {user:"Shin2xx2", pass:"123456789az"},
  {user:"tranmychau4x", pass:"1100110a"},
  {user:"bestpro08", pass:"9630621q"},
  {user:"mudamudawrys", pass:"kocomk123"},
  {user:"yinumber1", pass:"0981921745kito"}
];

let accounts = JSON.parse(localStorage.getItem("accList")) || defaultAccounts;
let count = Number(localStorage.getItem("count")) || 0;

window.addEventListener("DOMContentLoaded", () => {
  let countEl = document.getElementById("count");
  let remainingEl = document.getElementById("remaining");
  if(countEl) countEl.innerText = count;
  if(remainingEl) remainingEl.innerText = accounts.length;
});

function randomAcc() {
  playSound('click');
  
  let userSpins = Number(localStorage.getItem("userSpins")) || 0;
  if (userSpins <= 0) {
    showToast("❌ Bạn đã hết lượt! Vui lòng vượt link ngắn để nhận thêm lượt.");
    return;
  }

  if (!accounts || accounts.length === 0) {
    accounts = [...defaultAccounts];
  }

  userSpins--;
  localStorage.setItem("userSpins", userSpins);
  updateSpinUI();

  let randomIndex = Math.floor(Math.random() * accounts.length);
  let acc = accounts.splice(randomIndex, 1)[0];
  
  count++;
  localStorage.setItem("count", count);
  localStorage.setItem("accList", JSON.stringify(accounts));

  document.getElementById("count").innerText = count;
  document.getElementById("remaining").innerText = accounts.length;

  let resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <p style="color:#00ff88; font-weight:bold; margin-bottom:4px;">🎉 Chúc mừng bạn đã nhận được tài khoản:</p>
    <p>👤 Tài khoản: <span style="color:var(--primary-color)">${acc.user}</span></p>
    <p>🔑 Mật khẩu: <span style="color:var(--primary-color)">${acc.pass}</span></p>
    <button class="btn-action copy" onclick="copyAcc('${acc.user}', '${acc.pass}')">📋 SAO CHÉP TÀI KHOẢN</button>
  `;
  playSound('success');
}

function copyAcc(user, pass) {
  let text = `Tài khoản: ${user}\nMật khẩu: ${pass}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast("✅ Đã sao chép tài khoản thành công!");
    playSound('success');
  });
}

function resetData() {
  playSound('click');
  if(confirm("Bạn có chắc muốn nạp lại kho tài khoản ban đầu không?")) {
    accounts = [...defaultAccounts];
    count = 0;
    localStorage.setItem("accList", JSON.stringify(accounts));
    localStorage.setItem("count", count);
    document.getElementById("count").innerText = count;
    document.getElementById("remaining").innerText = accounts.length;
    document.getElementById("result").style.display = "none";
    showToast("🔄 Đã làm mới kho tài khoản thành công!");
  }
}

function copyScript(id) {
  playSound('click');
  let text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast("✅ Đã sao chép Script thành công!");
    playSound('success');
  });
}

  
/* ==================== BẬT/TẮT NHẠC ==================== */
function toggleMusic(e) {
  let music = document.getElementById("bgMusic");
  let btn = e ? e.target : event.target;
  
  if (music.paused) {
    music.play();
    btn.innerHTML = "🔇 Tắt Nhạc";
    showToast("🎶 Đã bật nhạc nền!");
  } else {
    music.pause();
    btn.innerHTML = "🎵 Bật Nhạc";
    showToast("🔇 Đã tắt nhạc nền!");
  }
}

/* ==================== BẢO VỆ F12 & CHUỘT PHẢI ==================== */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.keyCode === 123 || 
     (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
     (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))) {
    e.preventDefault();
    return false;
  }
});
