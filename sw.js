// sw.js

self.addEventListener("install", (event) => {
  console.log("✅ Service Worker instalado");
});

self.addEventListener("activate", (event) => {
  console.log("⚡ Service Worker activado");
});

self.addEventListener("fetch", (event) => {
  // Aquí puedes interceptar y cachear si lo necesitas en el futuro
});
