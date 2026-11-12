// ===================================
// CONFIGURACIÓN GENERAL
// ===================================

const CONFIG = {
  eventDate: "2026-12-19T18:00:00",
  whatsappNumber: "50558670302"
};


// ===================================
// MÚSICA DE FONDO
// ===================================

const audio = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

musicButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();

      musicButton.classList.add("playing");
      musicButton.textContent = "Ⅱ";
      musicButton.setAttribute("aria-label", "Pausar música");

    } catch {
      musicButton.title = "Agrega assets/cancion.mp3 para activar la música.";
    }

  } else {
    audio.pause();

    musicButton.classList.remove("playing");
    musicButton.textContent = "♫";
    musicButton.setAttribute("aria-label", "Reproducir música");
  }
});

audio.addEventListener("error", () => {
  musicButton.title = "Agrega el instrumental como assets/cancion.mp3.";
});


// ===================================
// CONFIRMACIÓN POR WHATSAPP
// ===================================

const confirmationText =
  "Hola, confirmo mi asistencia a los XV años de Jasiel Sarahi Velásquez Gutiérrez, el 19 de diciembre de 2026.";

document.getElementById("whatsappLink").href =
  `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(confirmationText)}`;


// ===================================
// CUENTA REGRESIVA
// ===================================

function updateCountdown() {

  const remaining = Math.max(
    0,
    new Date(CONFIG.eventDate).getTime() - Date.now()
  );

  const values = {
    days: Math.floor(remaining / 86400000),

    hours: Math.floor(
      (remaining % 86400000) / 3600000
    ),

    minutes: Math.floor(
      (remaining % 3600000) / 60000
    ),

    seconds: Math.floor(
      (remaining % 60000) / 1000
    )
  };

  Object.entries(values).forEach(([id, value]) => {
    document.getElementById(id).textContent =
      String(value).padStart(2, "0");
  });
}

updateCountdown();

setInterval(updateCountdown, 1000);


// ===================================
// ANIMACIÓN DE APARICIÓN
// ===================================

const revealObserver = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }

  });

}, {
  threshold: 0.2
});

document.querySelectorAll(".reveal").forEach(el => {
  revealObserver.observe(el);
});


// ===================================
// GALERÍA EDITORIAL
// ===================================

const track = document.getElementById("galleryTrack");

const photos = [
  ...track.querySelectorAll(".photo-frame")
];

const dots = document.getElementById("galleryDots");

const currentPhoto = document.getElementById("currentPhoto");

const totalPhotos = document.getElementById("totalPhotos");

let activePhoto = 0;


// Configurar contador

totalPhotos.textContent =
  String(photos.length).padStart(2, "0");


// Crear indicadores automáticamente

photos.forEach((_, index) => {

  const dot = document.createElement("button");

  dot.type = "button";

  dot.setAttribute(
    "aria-label",
    `Ver fotografía ${index + 1}`
  );

  dot.addEventListener("click", () => {
    showPhoto(index);
  });

  dots.appendChild(dot);

});


// Función principal del carrusel

function showPhoto(index) {

  if (!photos.length) return;

  // Navegación circular

  activePhoto = (index + photos.length) % photos.length;

  const photo = photos[activePhoto];

  const windowWidth = track.parentElement.clientWidth;

  // Centrar fotografía seleccionada

  const offset =
  photo.offsetLeft -
  (windowWidth - photo.offsetWidth) / 2;

  track.style.transform =
    `translateX(${-offset}px)`;


  // Activar fotografía seleccionada

  photos.forEach((item, i) => {

    item.classList.toggle(
      "is-active",
      i === activePhoto
    );

  });


  // Actualizar indicadores

  [...dots.children].forEach((dot, i) => {

    dot.classList.toggle(
      "active",
      i === activePhoto
    );

  });


  // Actualizar contador

  currentPhoto.textContent =
    String(activePhoto + 1).padStart(2, "0");

}


// Botón fotografía anterior

document.getElementById("prevPhoto").addEventListener("click", () => {

  showPhoto(activePhoto - 1);

});


// Botón fotografía siguiente

document.getElementById("nextPhoto").addEventListener("click", () => {

  showPhoto(activePhoto + 1);

});


// Reajustar galería al cambiar tamaño de pantalla

window.addEventListener("resize", () => {

  showPhoto(activePhoto);

});


// ===================================
// NAVEGACIÓN TÁCTIL
// ===================================

let touchX = 0;

track.addEventListener("touchstart", e => {

  touchX = e.changedTouches[0].clientX;

}, {
  passive: true
});


track.addEventListener("touchend", e => {

  const delta =
    e.changedTouches[0].clientX - touchX;

  if (Math.abs(delta) > 45) {

    showPhoto(
      activePhoto + (delta < 0 ? 1 : -1)
    );

  }

}, {
  passive: true
});


// Inicializar galería

showPhoto(0);


// ===================================
// DESTELLOS PLATEADOS
// ===================================

const canvas = document.getElementById("sparkles");

const ctx = canvas.getContext("2d");

let particles = [];

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


// Ajustar dimensiones del canvas

function resizeCanvas() {

  const ratio = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  canvas.width = innerWidth * ratio;

  canvas.height = innerHeight * ratio;

  canvas.style.width = innerWidth + "px";

  canvas.style.height = innerHeight + "px";

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);


  // Crear partículas

  particles = Array.from({

    length: Math.min(
      34,
      Math.floor(innerWidth / 13)
    )

  }, () => ({

    x: Math.random() * innerWidth,

    y: Math.random() * innerHeight,

    radius: Math.random() * 1.3 + .35,

    speed: Math.random() * .18 + .04,

    opacity: Math.random() * .38 + .12,

    phase: Math.random() * Math.PI * 2

  }));

}


// Dibujar destellos

function drawSparkles(time = 0) {

  ctx.clearRect(
    0,
    0,
    innerWidth,
    innerHeight
  );


  particles.forEach(p => {

    p.y -= p.speed;


    // Reiniciar partículas

    if (p.y < -5) {

      p.y = innerHeight + 5;

      p.x = Math.random() * innerWidth;

    }


    // Variación de luminosidad

    const alpha =
      p.opacity * (
        .65 + Math.sin(time * .0014 + p.phase) * .35
      );


    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(230,237,247,${Math.max(.04, alpha)})`;

    ctx.fill();

  });


  requestAnimationFrame(drawSparkles);

}


// Activar animación

if (!reduceMotion) {

  resizeCanvas();

  drawSparkles();

  window.addEventListener(
    "resize",
    resizeCanvas,
    { passive: true }
  );

}