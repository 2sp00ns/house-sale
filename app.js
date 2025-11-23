let fullList = [];

// Hide filter bar until labels load
document.addEventListener("DOMContentLoaded", () => {
  const fb = document.querySelector(".filter-bar");
  if (fb) fb.style.display = "none";
});

// Load listings from Google Apps Script web app API
async function loadListings() {
  try {
    const res = await fetch(API_URL);
    const list = await res.json();
    fullList = list;
    buildLabelFilters(list);
    setupFreeToggle();
    applyFilter();
  } catch (err) {
    document.getElementById("grid").innerHTML =
      `<p class="empty">Failed to load items.</p>`;
  }
}

function buildLabelFilters(list) {
  const container = document.getElementById("labelFilters");
  if (!container) return;

  const allLabels = new Set();
  list.forEach(item => {
    if (item.labels) {
      item.labels.forEach(l => allLabels.add(l));
    }
  });

  allLabels.forEach(label => {
    const btn = document.createElement("button");
    btn.className = "label-filter";
    btn.textContent = label;
    btn.dataset.label = label.toLowerCase();
    btn.onclick = () => {
      btn.classList.toggle("active");
      applyFilter();
    };
    container.appendChild(btn);
  });

  // Show filter bar now that labels are ready
  const fb = document.querySelector(".filter-bar");
  if (fb) fb.style.display = "flex";
}

function applyFilter() {
  const grid = document.getElementById("grid");

  const showFreeOnly = document.getElementById("freeToggle").classList.contains("on");

  const activeLabels = [...document.querySelectorAll(".label-filter.active")]
    .map(b => b.dataset.label);

  let filtered = fullList.slice();

  const selectedCats = activeLabels;

  filtered = fullList.filter(item => {
    const isItemFree = item.price.trim().toLowerCase() === "free";
    const matchesFree = showFreeOnly ? isItemFree : true;

    if (selectedCats.length === 0) {
      return matchesFree;
    }

    const itemCats = item.labels.map(l => l.toLowerCase());
    const matchesCats = selectedCats.some(l => itemCats.includes(l));

    return matchesFree && matchesCats;
  });

  filtered.sort((a, b) => {
    const aSold = a.sold ? 1 : 0;
    const bSold = b.sold ? 1 : 0;
    if (aSold !== bSold) return aSold - bSold;

    const aFree = a.price.trim().toLowerCase() === "free";
    const bFree = b.price.trim().toLowerCase() === "free";
    if (aFree && !bFree) return 1;
    if (!aFree && bFree) return -1;

    const aNum = parseFloat(a.price) || 0;
    const bNum = parseFloat(b.price) || 0;
    return bNum - aNum;
  });

  grid.innerHTML = "";

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty">No matching items.</p>';
    return;
  }

  filtered.forEach(item => {
    const rawPrice = item.price.trim();
    const isFree = rawPrice.toLowerCase() === "free";
    const numeric = !isFree && rawPrice !== "" && !isNaN(rawPrice);
    const displayPrice = isFree ? "free" : (numeric ? "€" + rawPrice : rawPrice);

    const card = document.createElement("article");
    card.className = "card";

    let imgsHtml = "";
    (item.images || []).forEach((url, idx) => {
      imgsHtml += `<img src="${url}" class="${idx === 0 ? "active" : ""}" alt="${item.name}">`;
    });

    card.innerHTML = `
      <div class="image-frame">
        ${imgsHtml}
        ${item.images.length > 1 ? `
          <button class="arrow left">❮</button>
          <button class="arrow right">❯</button>
        ` : ""}
        ${item.sold ? "" : `<div class="price-overlay ${isFree ? "free" : ""}">${displayPrice}</div>`}
        ${item.sold ? `<div class="sold-banner">SOLD</div>` : ""}
      </div>
      <div class="info">
        <p class="name">${item.name}</p>
      </div>
    `;

    grid.appendChild(card);

    if (item.images.length > 1) {
      const frame = card.querySelector(".image-frame");
      const imgs = frame.querySelectorAll("img");
      let index = 0;

      const show = i =>
        imgs.forEach((img, idx) => img.classList.toggle("active", idx === i));

      card.querySelector(".arrow.left").onclick = () => {
        index = (index - 1 + imgs.length) % imgs.length;
        show(index);
      };

      card.querySelector(".arrow.right").onclick = () => {
        index = (index + 1) % imgs.length;
        show(index);
      };
    }
  });
}

loadListings();

function setupFreeToggle() {
  const toggle = document.getElementById("freeToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    // Toggle state on the actual toggle button
    const isOn = toggle.classList.toggle("on");

    // Update ARIA for accessibility
    toggle.setAttribute("aria-pressed", isOn ? "true" : "false");

    applyFilter();
  });
}
