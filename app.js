(() => {
  const properties = window.HOUSE_X_PROPERTIES || [];
  const grid = document.getElementById("propertyGrid");
  const tabs = document.getElementById("filterTabs");
  const sort = document.getElementById("sortSelect");
  const modal = document.getElementById("propertyModal");
  const modalContent = document.getElementById("modalContent");
  let activeFilter = "all", maxPrice = Infinity;
  const money = value => new Intl.NumberFormat("ru-RU").format(value) + " ₽";
  const area = value => Number.isInteger(value) ? value + " м²" : value.toLocaleString("ru-RU") + " м²";
  function render() {
    let items = properties.filter(p => (activeFilter === "all" || p.type === activeFilter) && p.price <= maxPrice);
    if (sort.value === "cheap") items.sort((a,b) => a.price-b.price);
    if (sort.value === "expensive") items.sort((a,b) => b.price-a.price);
    grid.innerHTML = items.length ? items.map(p =>
      '<article class="property-card" data-id="' + p.id + '" tabindex="0" aria-label="Подробнее: ' + p.title + '">' +
      '<div class="property-image"><img src="' + p.image + '" alt="' + p.title + '" loading="lazy"><span class="property-tag">' + p.status + '</span><button class="property-fav" type="button" aria-label="Добавить в избранное" data-fav>♡</button></div>' +
      '<div class="property-info"><div class="property-meta"><span>' + p.type + '</span><span>ХАУС-Х / ' + String(p.id).padStart(3,"0") + '</span></div><h3 class="property-title">' + p.title + '</h3><div class="property-location">' + p.location + '</div><div class="property-specs"><span>' + area(p.area) + '</span>' + (p.rooms ? '<span>' + p.rooms + ' комнаты</span>' : '') + '<span>' + p.floor + '</span></div><div class="property-price-row"><b class="property-price">' + money(p.price) + '</b><span class="property-more">Подробнее ↗</span></div></div></article>'
    ).join("") : '<div class="empty-state">Подходящих объектов пока нет. Измените параметры поиска или обратитесь к нам за персональным подбором.</div>';
    const count = document.querySelector('#filterTabs [data-filter="all"] sup');
    if (count) count.textContent = String(properties.length).padStart(2,"0");
  }
  function openProperty(id) {
    const p = properties.find(item => item.id === Number(id)); if (!p) return;
    modalContent.innerHTML = '<div class="modal-hero"><img src="' + p.image + '" alt="' + p.title + '"></div><div class="modal-body"><div class="section-kicker"><span></span> ' + p.type.toUpperCase() + ' · ' + p.status.toUpperCase() + '</div><h2 id="modalTitle">' + p.title + '</h2><div class="property-location">' + p.location + '</div><div class="modal-facts"><span>' + area(p.area) + '</span>' + (p.rooms ? '<span>' + p.rooms + ' комнаты</span>' : '') + '<span>' + p.floor + '</span></div><div class="modal-price">' + money(p.price) + '</div><p>' + p.description + '</p><p><b>Особенности:</b> ' + p.features.join(" · ") + '</p><div class="modal-actions"><a class="btn" href="#contacts" data-close>Запросить информацию <span>↗</span></a><a class="phone-action" href="tel:+73842000000">+7 (3842) 00-00-00</a></div></div>';
    modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("no-scroll");
  }
  function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.classList.remove("no-scroll"); }
  tabs.addEventListener("click", e => { const b=e.target.closest("button[data-filter]"); if(!b)return; activeFilter=b.dataset.filter; maxPrice=Infinity; document.getElementById("quickPrice").value="all"; tabs.querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b)); render(); });
  sort.addEventListener("change",render);
  grid.addEventListener("click",e=>{const f=e.target.closest("[data-fav]");if(f){e.stopPropagation();f.textContent=f.textContent==="♡"?"♥":"♡";f.classList.toggle("selected");return;}const c=e.target.closest("[data-id]");if(c)openProperty(c.dataset.id);});
  grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-id]")){e.preventDefault();openProperty(e.target.dataset.id);}});
  modal.addEventListener("click",e=>{if(e.target.matches("[data-close]")||e.target.classList.contains("modal-backdrop"))closeModal();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
  document.getElementById("quickSearch").addEventListener("submit",e=>{e.preventDefault();activeFilter=document.getElementById("quickType").value;const v=document.getElementById("quickPrice").value;maxPrice=v==="all"?Infinity:Number(v);tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));render();document.getElementById("catalog").scrollIntoView({behavior:"smooth"});});
  const menuToggle=document.getElementById("menuToggle"), nav=document.getElementById("mainNav"), sidebar=nav.closest(".sidebar");
  menuToggle.addEventListener("click",()=>{const opened=sidebar.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(opened));});
  nav.addEventListener("click",e=>{const link=e.target.closest("a");if(link){sidebar.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");nav.querySelectorAll("a").forEach(a=>a.classList.toggle("active",a===link));}});
  document.getElementById("contactForm").addEventListener("submit",e=>{e.preventDefault();const data=new FormData(e.currentTarget),phone=String(data.get("phone")||"").replace(/\D/g,""),feedback=document.getElementById("formFeedback");if(phone.length<10){feedback.textContent="Проверьте номер телефона — кажется, в нём не хватает цифр.";return;}feedback.textContent="Проверка данных пройдена. Приём заявок подключим на серверном этапе — сейчас данные никуда не отправляются.";});

  // Subtle cursor light in the hero: makes the photographic X feel like a living interface.
  const hero = document.querySelector(".brand-hero");
  if (hero && window.matchMedia("(pointer:fine)").matches) {
    hero.addEventListener("pointermove", event => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width * 100) + "%");
      hero.style.setProperty("--my", ((event.clientY - rect.top) / rect.height * 100) + "%");
    });
  }
  // Reveal large content blocks gently as they enter the viewport.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealTargets = document.querySelectorAll(".quick-panel,.property-card,.service-tile,.about-strip,.contact-panel");
    revealTargets.forEach(el => el.classList.add("will-reveal"));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), {threshold:0.08});
    revealTargets.forEach(el => observer.observe(el));
  }

  render();
})();