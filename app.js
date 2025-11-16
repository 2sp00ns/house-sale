let fullList = [];

// Load listings from Google Apps Script web app API
async function loadListings() {
  try {
    const res = await fetch(API_URL);
    const list = await res.json();
    fullList = list;
    applyFilter();
  } catch (err) {
    document.getElementById("grid").innerHTML =
      `<p class="empty">Failed to load items.</p>`;
  }
}

function applyFilter() {
  const grid = document.getElementById("grid");
  const onlyFree = document.getElementById("filterFree").checked;

  const filtered = onlyFree
    ? fullList.filter(i => i.price.trim().toLowerCase() === "free")
    : fullList;

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
        <div class="price-overlay ${isFree ? "free" : ""}">${displayPrice}</div>
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

document.getElementById("filterFree").addEventListener("change", applyFilter);

loadListings();
