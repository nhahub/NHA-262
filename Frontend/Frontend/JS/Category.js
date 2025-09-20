// JS لتظليل النجوم
const stars = document.querySelectorAll(".star");

stars.forEach(star => {
  star.addEventListener("click", () => {
    const value = star.getAttribute("data-value");

    stars.forEach(s => {
      s.classList.toggle("active", s.getAttribute("data-value") <= value);
    });
  });
});
