let locks = 0;

export function lockPublicOverlay() {
  if (typeof document === "undefined") return;
  locks += 1;
  document.body.classList.add("overlay-open");
  document.body.style.overflow = "hidden";
}

export function unlockPublicOverlay() {
  if (typeof document === "undefined") return;
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.classList.remove("overlay-open");
    document.body.style.overflow = "";
  }
}
