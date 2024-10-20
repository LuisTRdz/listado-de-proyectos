document.addEventListener("DOMContentLoaded", function() {
  // Cerrar el modal
  document.getElementById('closeModal').onclick = function() {
    document.getElementById('contactModal').classList.add('hidden');
  };

  // Abrir el modal al hacer clic en el enlace "Contact"
  document.querySelector('a[href="#Contact"]').onclick = function(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    document.getElementById('contactModal').classList.remove('hidden');
  };

  // Funcionalidad del botón de menú
  const menuButton = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  menuButton.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
});