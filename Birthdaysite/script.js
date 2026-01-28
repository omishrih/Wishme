/* ==========================
   Premium Birthday Website JS
========================== */

let inputModal, nameInput, dobInput, submitBtn, mainContainer, navbar;
let slideIndex = 0;
let autoPlayInterval = null;
let counterInterval = null;

/* =====================
   Toast
===================== */
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2200);
}

/* =====================
   Sparkle Effect
===================== */
function createSparkles(x, y, color = "#ffcc00") {
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement("div");
    sparkle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 8px;
      height: 8px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      box-shadow: 0 0 8px ${color};
    `;
    document.body.appendChild(sparkle);

    const angle = (i / 8) * Math.PI * 2;
    const velocity = 3 + Math.random() * 3;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    let opacity = 1;
    let sx = x;
    let sy = y;

    const animate = () => {
      sx += vx;
      sy += vy;
      opacity -= 0.03;
      sparkle.style.left = sx + "px";
      sparkle.style.top = sy + "px";
      sparkle.style.opacity = opacity;

      if (opacity > 0) requestAnimationFrame(animate);
      else sparkle.remove();
    };
    animate();
  }
}

/* =====================
   Playlist Music
===================== */
const playlist = [
  { name: "Palke Jhapakta Hai Aasman", src: "music/song1.mp3" },
  { name: "Romantic Love Song", src: "music/song2.mp3" },
  { name: "Birthday Special", src: "music/song3.mp3" }
];

let currentTrack = 0;

const audio = document.getElementById("bgMusic");
const playBtn = document.getElementById("musicToggle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const songName = document.getElementById("songName");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");

function loadSong(index) {
  audio.src = playlist[index].src;
  songName.innerText = "🎵 " + playlist[index].name;
  audio.load();
}

function playSong() {
  audio
    .play()
    .then(() => {
      playBtn.innerText = "⏸";
      playBtn.classList.add("playing");
    })
    .catch(() => {
      showToast("🎶 Tap Play to start music");
    });
}

function pauseSong() {
  audio.pause();
  playBtn.innerText = "▶️";
  playBtn.classList.remove("playing");
}

playBtn?.addEventListener("click", (e) => {
  createSparkles(e.clientX, e.clientY, "#ff9442");
  if (audio.paused) playSong();
  else pauseSong();
});

nextBtn?.addEventListener("click", (e) => {
  createSparkles(e.clientX, e.clientY, "#00c6ff");
  currentTrack = (currentTrack + 1) % playlist.length;
  loadSong(currentTrack);
  playSong();
});

prevBtn?.addEventListener("click", (e) => {
  createSparkles(e.clientX, e.clientY, "#ff2d78");
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadSong(currentTrack);
  playSong();
});

audio?.addEventListener("ended", () => {
  nextBtn.click();
});

audio?.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
});

progressContainer?.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});

loadSong(currentTrack);
if (audio) audio.volume = 0.6;

/* =====================
   Init Website
===================== */
document.addEventListener("DOMContentLoaded", () => {
  initializeElements();
  attachEvents();
  checkUserData();
  initSlides();
  startHearts();
});

function initializeElements() {
  inputModal = document.getElementById("inputModal");
  nameInput = document.getElementById("nameInput");
  dobInput = document.getElementById("dobInput");
  submitBtn = document.getElementById("submitBtn");
  mainContainer = document.getElementById("mainContainer");
  navbar = document.getElementById("navbar");
}

/* =====================
   Navbar Toggle (Mobile)
===================== */
function initNavbarToggle() {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle?.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navToggle.innerText = navLinks.classList.contains("open") ? "✖" : "☰";
  });

  // ✅ auto close menu after clicking link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 600) {
        navLinks?.classList.remove("open");
        if (navToggle) navToggle.innerText = "☰";
      }
    });
  });
}

function attachEvents() {
  initNavbarToggle();

  submitBtn?.addEventListener("click", handleSubmit);

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      showPage(page);
      createSparkles(e.clientX, e.clientY, "#ff2d78");

      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const page = btn.getAttribute("data-go");
      showPage(page);
      createSparkles(e.clientX, e.clientY, "#00c6ff");

      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
      document.querySelector(`.nav-link[data-page="${page}"]`)?.classList.add("active");
    });
  });

  document.getElementById("resetBtn")?.addEventListener("click", clearData);

  document.getElementById("cakeBtn")?.addEventListener("click", (e) => {
    cakeCut();
    createSparkles(e.clientX, e.clientY, "#ff6b6b");
  });

  document.getElementById("knife")?.addEventListener("click", (e) => {
    cakeCut();
    createSparkles(e.clientX, e.clientY, "#ffcc00");
  });

  document.getElementById("prevSlide")?.addEventListener("click", () => changeSlide(-1));
  document.getElementById("nextSlide")?.addEventListener("click", () => changeSlide(1));

  document.getElementById("autoPlayBtn")?.addEventListener("click", startAutoPlay);
  document.getElementById("stopPlayBtn")?.addEventListener("click", stopAutoPlay);

  document.querySelectorAll("#slideDots .dot").forEach((dot, i) => {
    dot.addEventListener("click", (e) => {
      currentSlide(i);
      createSparkles(e.clientX, e.clientY, "#ffffff");
    });
  });

  document.getElementById("openGiftBtn")?.addEventListener("click", (e) => {
    openGift();
    createSparkles(e.clientX, e.clientY, "#ff6b6b");
  });

  document.getElementById("celebrateBtn")?.addEventListener("click", (e) => {
    triggerConfetti();
    createSparkles(e.clientX, e.clientY, "#00c6ff");
  });

  document.getElementById("openLetter")?.addEventListener("click", (e) => {
    openLoveLetter();
    createSparkles(e.clientX, e.clientY, "#f093fb");
  });

  document.getElementById("closeLetter")?.addEventListener("click", () => {
    document.getElementById("letterModal").classList.add("hidden");
  });

  document.getElementById("letterModal")?.addEventListener("click", (e) => {
    if (e.target.id === "letterModal") document.getElementById("letterModal").classList.add("hidden");
  });

  document.querySelectorAll(".letter-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      openOpenWhenLetter(parseInt(card.dataset.letter));
      createSparkles(e.clientX, e.clientY, "#f093fb");
    });
  });

  document.getElementById("closeOpenWhen")?.addEventListener("click", closeOpenWhenLetter);

  document.getElementById("letterContentModal")?.addEventListener("click", (e) => {
    if (e.target.id === "letterContentModal") closeOpenWhenLetter();
  });

  document.getElementById("shareWhatsApp")?.addEventListener("click", (e) => {
    shareLink("whatsapp");
    createSparkles(e.clientX, e.clientY, "#25d366");
  });

  document.getElementById("shareGalleryWhatsApp")?.addEventListener("click", (e) => {
    shareLink("whatsappGallery");
    createSparkles(e.clientX, e.clientY, "#25d366");
  });

  document.getElementById("shareFacebook")?.addEventListener("click", (e) => {
    shareLink("facebook");
    createSparkles(e.clientX, e.clientY, "#1877f2");
  });

  document.getElementById("shareTwitter")?.addEventListener("click", (e) => {
    shareLink("twitter");
    createSparkles(e.clientX, e.clientY, "#1da1f2");
  });
}

/* =====================
   Submit
===================== */
function handleSubmit() {
  const name = nameInput.value.trim();
  const dob = dobInput.value;

  if (!name || !dob) {
    showToast("⚠️ Enter name and DOB");
    return;
  }

  localStorage.setItem("userName", name);
  localStorage.setItem("userDOB", dob);

  applyUserData(name, dob);

  // ✅ music best practice: play after interaction
  playSong();
}

/* =====================
   User Data Check + Hide/Show Music Player
===================== */
function checkUserData() {
  const savedName = localStorage.getItem("userName");
  const savedDOB = localStorage.getItem("userDOB");

  const musicPlayer = document.querySelector(".music-player");

  if (savedName && savedDOB) {
    applyUserData(savedName, savedDOB);
    musicPlayer?.classList.remove("hidden");
  } else {
    inputModal.classList.remove("hidden");
    mainContainer.classList.add("hidden");
    navbar.classList.add("hidden");

    // ✅ Hide music player in enter name/dob screen
    musicPlayer?.classList.add("hidden");
  }
}

function applyUserData(name, dob) {
  document.getElementById("gfName").innerText = name;
  document.getElementById("surpriseName").innerText = name;
  document.getElementById("yourName").innerText = "Akash";

  inputModal.classList.add("hidden");
  mainContainer.classList.remove("hidden");
  navbar.classList.remove("hidden");

  // ✅ Show music after unlock
  document.querySelector(".music-player")?.classList.remove("hidden");

  if (counterInterval) clearInterval(counterInterval);
  startBirthdayCounter(dob);

  showPage("home");
}

/* =====================
   Pages
===================== */
function showPage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
    page.classList.add("hidden");
  });

  const page = document.getElementById(pageName + "Page");
  if (page) {
    page.classList.add("active");
    page.classList.remove("hidden");
  }
}

/* =====================
   Birthday Counter
===================== */
function startBirthdayCounter(dobString) {
  function updateCounter() {
    const dob = new Date(dobString);
    const now = new Date();

    let nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday < now) {
      nextBirthday = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
    }

    const diff = nextBirthday - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    const age = now.getFullYear() - dob.getFullYear();
    const ageText = document.getElementById("ageText");

    if (days === 0 && hours < 24) {
      ageText.innerText = `🎉 Happy Birthday! Today you turn ${age}! 🎉`;
    } else {
      ageText.innerText = `💖 You are ${age} years old • Next birthday in ${days} days`;
    }
  }

  updateCounter();
  counterInterval = setInterval(updateCounter, 1000);
}

/* =====================
   Cake Cut
===================== */
function cakeCut() {
  const cakeReal = document.getElementById("cakeReal");
  const cakeMessage = document.getElementById("cakeMessage");
  const knife = document.getElementById("knife");

  knife.classList.add("cutmove");
  cakeReal.classList.add("cut");
  cakeReal.classList.add("blow");
  cakeMessage.classList.remove("hidden");

  triggerConfetti();

  setTimeout(() => knife.classList.remove("cutmove"), 900);
  setTimeout(() => {
    cakeMessage.classList.add("hidden");
    cakeReal.classList.remove("cut");
    cakeReal.classList.remove("blow");
  }, 2600);
}

/* =====================
   Slideshow
===================== */
function initSlides() { showSlide(0); }
function changeSlide(n) { showSlide(slideIndex + n); }
function currentSlide(n) { showSlide(n); }

function showSlide(n) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll("#slideDots .dot");
  if (!slides.length) return;

  slideIndex = n;
  if (slideIndex >= slides.length) slideIndex = 0;
  if (slideIndex < 0) slideIndex = slides.length - 1;

  slides.forEach((s) => (s.style.display = "none"));
  dots.forEach((d) => d.classList.remove("active"));

  slides[slideIndex].style.display = "block";
  dots[slideIndex]?.classList.add("active");
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayInterval = setInterval(() => changeSlide(1), 2800);
}
function stopAutoPlay() {
  clearInterval(autoPlayInterval);
  autoPlayInterval = null;
}

/* =====================
   Gift (Read My Heart typing + Song3)
===================== */
function openGift() {
  const giftBox = document.getElementById("giftBox");
  const surpriseContent = document.getElementById("surpriseContent");
  const heartText = document.getElementById("heartText");

  giftBox?.classList.add("opened");
  surpriseContent?.classList.remove("hidden");
  triggerConfetti();

  // ✅ AUTO PLAY SONG 3
  currentTrack = 2;
  loadSong(currentTrack);
  playSong();

  if (!heartText) return;

  const messages = [
    "My Love 💖",
    "Today is your birthday 🎂✨",
    "And I just want you to know...",
    "You are my happiness 😊",
    "You are my peace 🕊️",
    "You are my favorite person forever ❤️",
    "",
    "You deserve the world 🌍",
    "But I’ll give you all the love in mine 💕",
    "",
    "I Love You More Than Words Can Say 💞"
  ];

  heartText.innerText = "";
  heartText.classList.add("typing-cursor");

  let lineIndex = 0;

  function typeLine(text, callback) {
    let charIndex = 0;

    const typer = setInterval(() => {
      heartText.innerText += text.charAt(charIndex);
      charIndex++;

      if (charIndex >= text.length) {
        clearInterval(typer);
        heartText.innerText += "\n";
        setTimeout(callback, 350);
      }
    }, 28);
  }

  function startTyping() {
    if (lineIndex >= messages.length) {
      heartText.classList.remove("typing-cursor");
      return;
    }

    typeLine(messages[lineIndex], () => {
      lineIndex++;
      startTyping();
    });
  }

  startTyping();
}

/* =====================
   Confetti
===================== */
function triggerConfetti() {
  const container = document.getElementById("confetti");
  if (!container) return;

  container.innerHTML = "";
  for (let i = 0; i < 100; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti";
    conf.style.left = Math.random() * 100 + "%";
    conf.style.top = Math.random() * 20 + "px";
    conf.style.animationDelay = Math.random() * 0.7 + "s";
    conf.style.animationDuration = 2.5 + Math.random() * 0.8 + "s";
    conf.style.transform = `rotate(${Math.random() * 360}deg)`;

    const colors = ["#ff6b6b", "#ffa94d", "#00c6ff", "#f093fb", "#ffffff", "#ffcc00", "#25d366"];
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(conf);
  }

  setTimeout(() => (container.innerHTML = ""), 3500);
}

/* =====================
   Love Letter
===================== */
function openLoveLetter() {
  document.getElementById("letterModal").classList.remove("hidden");
  const letter = document.getElementById("letterText");

  const text = `My love 💖\n\nEvery day with you feels like a beautiful dream.\nYou make my world brighter, my heart warmer, and my life complete.\nOn your birthday, I just want to say...\n\nI will always choose you 💕`;

  letter.innerText = "";
  let i = 0;
  const typing = setInterval(() => {
    letter.innerText += text[i] || "";
    i++;
    if (i >= text.length) clearInterval(typing);
  }, 20);
}

/* =====================
   Open When Letters
===================== */
const letters = [
  { title: "📖 When You're Sad", content: `My love 💕\n\nWhen you feel sad, remember — storms pass.\nYou’re stronger than you think and loved more than you know.\nI’m always with you. ❤️` },
  { title: "😊 When You're Happy", content: `My sunshine 🌟\n\nYour smile is my favorite view.\nKeep laughing and shining — I love seeing you happy 💖` },
  { title: "💪 When You Need Strength", content: `My strong girl 💪\n\nYou can do anything.\nEven when life is hard, you will win.\nAnd I will always support you ❤️` },
  { title: "❤️ When You Miss Me", content: `My baby ❤️\n\nDistance can’t break love.\nClose your eyes and feel my hug.\nI’m missing you too 💕` },
  { title: "🌟 When You Doubt Yourself", content: `My queen 👑\n\nNever doubt yourself.\nYou’re talented, beautiful, and powerful.\nI believe in you forever ✨` },
  { title: "🎂 Your Birthday", content: `Happy Birthday My Love 🎂💕\n\nToday is your day!\nI wish you happiness, success and love.\nMay all your dreams come true ✨` }
];

function openOpenWhenLetter(index) {
  document.getElementById("letterTitle").innerText = letters[index].title;
  document.getElementById("letterContent").innerText = letters[index].content;
  document.getElementById("letterContentModal").classList.remove("hidden");
}

function closeOpenWhenLetter() {
  document.getElementById("letterContentModal").classList.add("hidden");
}

/* =====================
   Share
===================== */
function shareLink(type) {
  const pageUrl = window.location.href;

  if (type === "whatsapp") {
    const text = `🎂 A special birthday surprise made with love 💖\n${pageUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }
  if (type === "whatsappGallery") {
    const text = `📸 Look at these cute memories 💕\n${pageUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }
  if (type === "facebook") {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank");
  }
  if (type === "twitter") {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("🎂 Celebrating with love 💖 " + pageUrl)}`, "_blank");
  }
}

/* =====================
   Hearts
===================== */
function startHearts() {
  const heartContainer = document.querySelector(".hearts");
  if (!heartContainer) return;

  setInterval(() => {
    const heart = document.createElement("span");
    const hearts = ["❤️", "💖", "💕", "💗", "💘", "💞", "💝"];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 3 + Math.random() * 3 + "s";
    heart.style.fontSize = 16 + Math.random() * 26 + "px";
    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6500);
  }, 200);
}

/* =====================
   Reset
===================== */
function clearData() {
  if (confirm("Reset everything? You will enter details again.")) {
    localStorage.removeItem("userName");
    localStorage.removeItem("userDOB");
    location.reload();
  }
}
