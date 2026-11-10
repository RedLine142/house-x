(() => {
  const properties = window.HOUSE_X_PROPERTIES || [];
  const grid = document.getElementById("propertyGrid");
  const tabs = document.getElementById("filterTabs");
  const sort = document.getElementById("sortSelect");
  const modal = document.getElementById("propertyModal");
  const modalContent = document.getElementById("modalContent");
  let activeFilter = "all";

  const money = value => new Intl.NumberFormat("ru-RU").format(value) + " ₽";
  const area = value => Number.isInteger(value) ? value + " м²" : value.toLocaleString("ru-RU") + " м²";

  function render() {
    let items = properties.filter(p => activeFilter === "all" || p.type === activeFilter);
    if (sort.value === "cheap") items.sort((a,b) => a.price-b.price);
    if (sort.value === "expensive") items.sort((a,b) => b.price-a.price);
    grid.innerHTML = items.length ? items.map(p => `
      <article class="property-card" data-id="${p.id}" tabindex="0" aria-label="Подробнее: ${p.title}">
        <div class="property-image"><img src="${p.image}" alt="${p.title}" loading="lazy"><span class="property-tag">${p.status}</span><button class="property-fav" type="button" aria-label="Добавить в избранное" data-fav>♡</button></div>
        <div class="property-info"><div class="property-meta"><span>${p.type}</span><span>ХАУС-Х / ${String(p.id).padStart(3,"0")}</span></div><h3 class="property-title">${p.title}</h3><div class="property-location">${p.location}</div><div class="property-specs"><span>${area(p.area)}</span>${p.rooms ? `<span>${p.rooms} комнаты</span>` : ""}<span>${p.floor}</span></div><div class="property-price-row"><b class="property-price">${money(p.price)}</b><span class="property-more">Подробнее ↗</span></div></div>
      </article>`).join("") : '<div class="empty-state">По выбранным параметрам объектов пока нет. Попробуйте изменить фильтр.</div>';
    const count = document.querySelector('#filterTabs [data-filter="all"] sup');
    if (count) count.textContent = String(properties.length).padStart(2,"0");
  }

  function openProperty(id) {
    const p = properties.find(item => item.id === Number(id));
    if (!p) return;
    modalContent.innerHTML = `<div class="modal-hero"><img src="${p.image}" alt="${p.title}"></div><div class="modal-body"><div class="eyebrow"><span></span> ${p.type.toUpperCase()} · ${p.status.toUpperCase()}</div><h2 id="modalTitle">${p.title}</h2><div class="property-location">${p.location}</div><div class="modal-facts"><span>${area(p.area)}</span>${p.rooms ? `<span>${p.rooms} комнаты</span>` : ""}<span>${p.floor}</span></div><div class="modal-price">${money(p.price)}</div><p>${p.description}</p><p><b>Особенности:</b> ${p.features.join(" · ")}</p><div class="modal-actions"><a class="btn btn-dark" href="#contacts" data-close>Запросить информацию <span>↗</span></a><a class="phone-action" href="tel:+73842000000">+7 (3842) 00-00-00</a></div></div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("no-scroll");
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("no-scroll");
  }

  tabs.addEventListener("click", e => {
    const button = e.target.closest("button[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    tabs.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === button));
    render();
  });
  sort.addEventListener("change", render);
  grid.addEventListener("click", e => {
    const fav = e.target.closest("[data-fav]");
    if (fav) { e.stopPropagation(); fav.textContent = fav.textContent === "♡" ? "♥" : "♡"; fav.classList.toggle("selected"); return; }
    const card = e.target.closest("[data-id]");
    if (card) openProperty(card.dataset.id);
  });
  grid.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-id]")) { e.preventDefault(); openProperty(e.target.dataset.id); } });
  modal.addEventListener("click", e => { if (e.target.matches("[data-close]") || e.target.classList.contains("modal-backdrop")) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  document.getElementById("quickSearch").addEventListener("submit", e => {
    e.preventDefault();
    const type = document.getElementById("quickType").value;
    const price = document.getElementById("quickPrice").value;
    activeFilter = type;
    tabs.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.filter === type));
    render();
    if (price !== "all") {
      const max = Number(price);
      grid.querySelectorAll("[data-id]").forEach(card => {
        const item = properties.find(p => p.id === Number(card.dataset.id));
        card.hidden = item.price > max;
      });
    }
    document.getElementById("catalog").scrollIntoView({behavior:"smooth"});
  });

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  menuToggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(opened));
  });
  nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded","false"); } });

  document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const phone = String(data.get("phone") || "").replace(/\D/g,"");
    const feedback = document.getElementById("formFeedback");
    if (phone.length < 10) { feedback.textContent = "Проверьте номер телефона — кажется, в нём не хватает цифр."; return; }
    feedback.textContent = "Форма и проверка данных работают. Приём заявок подключим на серверном этапе — сейчас данные никуда не отправляются.";
  });

  render();
})();