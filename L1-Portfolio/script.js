const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => navbar.classList.toggle("open"));

document.querySelectorAll(".navbar a").forEach(link => {
  link.addEventListener("click", () => navbar.classList.remove("open"));
});

document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("formMessage").textContent =
    "Thank you! This demo form is ready to connect with a backend or email service.";
  this.reset();
});