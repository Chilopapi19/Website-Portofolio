// Mobile Menu Handler
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Scroll Reveal Animation
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;

  reveals.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight - 80) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Filtering Proyek
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => {
      b.classList.remove("active", "gradient-bg", "text-white", "shadow-sm");
      b.classList.add("bg-slate-100", "text-slate-600");
    });
    btn.classList.add("active", "gradient-bg", "text-white", "shadow-sm");
    btn.classList.remove("bg-slate-100", "text-slate-600");

    const filter = btn.getAttribute("data-filter");

    projectCards.forEach((card) => {
      const categories = card.getAttribute("data-category").split(" ");
      if (filter === "all" || categories.includes(filter)) {
        card.style.display = "flex";
        setTimeout(() => (card.style.opacity = "1"), 10);
      } else {
        card.style.opacity = "0";
        setTimeout(() => (card.style.display = "none"), 200);
      }
    });
  });
});

// Modal Handler
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

function openProjectModal(title, desc, techArray = []) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-desc").innerText = desc;

  const badgesContainer = document.getElementById("modal-tech-badges");
  badgesContainer.innerHTML = "";
  techArray.forEach((tech) => {
    const badge = document.createElement("span");
    badge.className =
      "px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold";
    badge.innerText = tech;
    badgesContainer.appendChild(badge);
  });

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  setTimeout(() => {
    modalContent.classList.remove("scale-95", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");
  }, 10);
}

function closeModal() {
  modalContent.classList.remove("scale-100", "opacity-100");
  modalContent.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }, 200);
}

// Tahun Otomatis
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Kirim Pesan
const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/rian1905.work@gmail.com";

const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const btnLabel = submitBtn.querySelector("span");
  const originalLabel = btnLabel.textContent;
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  submitBtn.disabled = true;
  submitBtn.classList.add("opacity-70", "cursor-not-allowed");
  btnLabel.textContent = "Mengirim...";

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message,
        _subject: "Pesan Portofolio: " + subject,
        _replyto: email,
        _template: "table",
        _captcha: "false",
        _honey: "",
      }),
    });
    const result = await response.json();

    if (response.ok && String(result.success) === "true") {
      openProjectModal(
        "Pesan Terkirim!",
        `Terima kasih ${name}, pesan Anda telah berhasil dikirim. Saya akan segera merespons melalui email.`,
        ["Status: Sukses"],
      );
      contactForm.reset();
    } else {
      throw new Error(result.message || "Gagal mengirim");
    }
  } catch (err) {
    openProjectModal(
      "Pesan Gagal Terkirim",
      "Maaf, terjadi kendala saat mengirim pesan. Silakan coba lagi, atau hubungi langsung melalui rian1905.work@gmail.com.",
      ["Status: Gagal"],
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
    btnLabel.textContent = originalLabel;
  }
});
