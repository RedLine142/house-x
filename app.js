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
      '<div class="property-image">' + (p.image ? '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy">' : '<div class="property-image-placeholder" role="img" aria-label="Фотографии объекта скоро появятся"><span>ХАУС-X</span><small>ФОТОГАЛЕРЕЯ ГОТОВИТСЯ</small></div>') + '<span class="property-tag">' + p.status + '</span><button class="property-fav" type="button" aria-label="Добавить в избранное" data-fav>♡</button></div>' +
      '<div class="property-info"><div class="property-meta"><span>' + p.type + '</span><span>ХАУС-Х / ' + String(p.id).padStart(3,"0") + '</span></div><h3 class="property-title">' + p.title + '</h3><div class="property-location">' + p.location + '</div><div class="property-specs"><span>' + area(p.area) + '</span>' + (p.rooms ? '<span>' + p.rooms + ' комнаты</span>' : '') + '<span>' + p.floor + '</span></div><div class="property-price-row"><b class="property-price">' + money(p.price) + '</b><span class="property-more">Подробнее <svg class="ui-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 12.5 12.5 3.5 M6 3.5h6.5V10" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div></div></article>'
    ).join("") : '<div class="empty-state">Подходящих объектов пока нет. Измените параметры поиска или обратитесь к нам за персональным подбором.</div>';
    const count = document.querySelector('#filterTabs [data-filter="all"] sup');
    if (count) count.textContent = String(properties.length).padStart(2,"0");
  }
  function openProperty(id) {
    const p = properties.find(item => item.id === Number(id)); if (!p) return;
    modalContent.innerHTML = (p.image ? '<div class="modal-hero"><img src="' + p.image + '" alt="' + p.title + '"></div>' : '<div class="modal-hero" style="min-height:180px;display:grid;place-items:center;background:linear-gradient(135deg,#18232b,#0b0e12);color:#38d9ff;letter-spacing:.18em;font-weight:800">ХАУС-X</div>') + '<div class="modal-body"><div class="section-kicker"><span></span> ' + p.type.toUpperCase() + ' · ' + p.status.toUpperCase() + '</div><h2 id="modalTitle">' + p.title + '</h2><div class="property-location">' + p.location + '</div><div class="modal-facts"><span>' + area(p.area) + '</span>' + (p.rooms ? '<span>' + p.rooms + ' комнаты</span>' : '') + '<span>' + p.floor + '</span></div><div class="modal-price">' + money(p.price) + '</div><p>' + p.description + '</p><p><b>Особенности:</b> ' + p.features.join(" · ") + '</p>' + (p.details ? '<div class="property-details"><h3>Характеристики и описание</h3><ul>' + p.details.map(x => '<li>' + x + '</li>').join('') + '</ul></div>' : '') + '<div class="modal-actions"><a class="btn" href="#contacts" data-close>Запросить информацию <svg class="ui-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 12.5 12.5 3.5 M6 3.5h6.5V10" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></a><a class="phone-action" href="tel:+79049627770">+7 (904) 962-77-70</a></div></div>';
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
  document.querySelector(".workspace").addEventListener("click",e=>{if(!sidebar.classList.contains("open")||e.target.closest("#menuToggle"))return;sidebar.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");});
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


  // Animate newly added editorial sections when they enter the viewport.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const newReveal = document.querySelectorAll(".universe-card,.manifesto-band,.process-steps article,.journal-card");
    newReveal.forEach((el, index) => { el.classList.add("will-reveal"); el.style.transitionDelay = (index % 4) * 75 + "ms"; });
    const newObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); newObserver.unobserve(entry.target); }
    }), {threshold:0.08});
    newReveal.forEach(el => newObserver.observe(el));
  }


  const journalArticles = [{"id":1,"category":"ВЫБОР","title":"На что смотреть, когда выбираешь дом","summary":"Участок, конструктив, коммуникации и повседневный маршрут — важнее красивого фасада.","image":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1100&q=85","lead":"Дом выбирают не только глазами. Чтобы новое место действительно стало удобным, важно оценить не одну картинку, а всю систему: сам дом, участок, инженерные решения и жизнь вокруг.","body":["Красивый фасад и уютная терраса легко производят впечатление на просмотре. Но решение о покупке лучше принимать после спокойной проверки того, что скрыто за внешним видом. Начните с конструкции: обратите внимание на состояние фундамента, стен, перекрытий, кровли, окон и мест возможного контакта с влагой. Любые сомнения по техническому состоянию стоит передать профильному специалисту.","Следующий пункт — участок. Оцените рельеф, отвод дождевой и талой воды, состояние подъезда, границы и фактическое использование территории. Важно понять, где проходят коммуникации и останется ли место для парковки, сада, хозяйственной зоны или будущей пристройки.","Отдельно проверьте инженерную инфраструктуру: электрическую мощность и состояние вводов, источник воды, канализацию, отопление, вентиляцию и качество связи. Попросите показать документы и доступные сведения о подключениях, а не ограничивайтесь устными обещаниями.","И наконец, проживите обычный день в воображении. Сколько времени займёт дорога до работы, школы и магазинов? Как чистят улицу зимой? Есть ли освещение и общественный транспорт? Полезно приехать в разное время суток и поговорить с соседями.","Хороший выбор складывается из нескольких совпадений: дом подходит по состоянию, участок — по задачам, а окружение — по привычному ритму жизни. Составьте список обязательных условий до просмотров: так сравнивать варианты будет проще и честнее."]},{"id":2,"category":"ИНТЕРЬЕР","title":"Квартира как отражение характера","summary":"Планировка, свет и сценарии повседневной жизни меняют ощущение пространства сильнее декора.","image":"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85","lead":"Интерьер начинается не с цвета стен. Он начинается с того, как вы просыпаетесь, работаете, отдыхаете, принимаете гостей и проводите время дома.","body":["При выборе квартиры легко увлечься отделкой: модные оттенки, эффектная кухня и красивые детали создают цельный образ. Но отделку можно изменить, а планировка и расположение окон останутся основой пространства. Поэтому сначала оцените маршруты внутри квартиры и связь между комнатами.","Подумайте о своих сценариях. Нужна ли отдельная рабочая зона? Часто ли приезжают гости? Важно ли отделить спальню от общей комнаты? Где будет храниться сезонная одежда, спортивный инвентарь и бытовые вещи? Ответы на эти вопросы помогают понять, какая планировка будет удобной именно в ежедневном использовании.","Свет — ещё один важный инструмент. Посмотрите, куда выходят окна, как меняется освещение в течение дня и не перекрывают ли его соседние здания. Обратите внимание на возможность проветривания и на то, где можно разместить рабочее место без постоянного контрового света.","Не забывайте о пропорциях. Большая площадь сама по себе не гарантирует комфорта: длинные коридоры и неудобные проходы могут съедать полезное пространство. Иногда более компактная квартира с понятной геометрией оказывается практичнее.","Выбирайте не интерьер с фотографии, а основу для своего. Когда планировка соответствует привычкам, мебель и декор становятся способом выразить характер, а не попыткой исправить неудобства."]},{"id":3,"category":"ЗЕМЛЯ","title":"С чего начинается свой проект","summary":"Категория земли, подъезд, ограничения и коммуникации — первые пункты проверки перед покупкой.","image":"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1100&q=85","lead":"Участок — это не просто площадь на карте. Его назначение, расположение и ограничения определяют, что именно можно будет на нём реализовать.","body":["Начните с документов и сведений об участке. Сверьте кадастровый номер, площадь, границы и вид разрешённого использования. Уточните категорию земель и убедитесь, что предполагаемый проект соответствует установленным правилам.","Затем изучите градостроительные ограничения. В зависимости от территории могут действовать зоны с особыми условиями использования, красные линии, охранные зоны сетей, ограничения по отступам и высоте строительства. Для конкретного участка важно запросить актуальные официальные сведения, а не полагаться на слова продавца.","Физические характеристики тоже имеют значение. Рельеф, тип грунта, уровень грунтовых вод, риск подтопления и особенности подъезда влияют на стоимость подготовки территории и будущего строительства. При необходимости до покупки закажите инженерные изыскания.","Отдельно разберитесь с коммуникациями. Наличие столба рядом не означает, что подключение электричества будет простым; газовая труба поблизости не гарантирует возможность подключения. Запрашивайте условия, точки подключения, сроки и расходы у соответствующих организаций.","Сформулируйте задачу до выбора: постоянное проживание, дача, строительство дома для семьи или инвестиционный проект. Один и тот же участок может быть удачным для одной цели и неудобным для другой. Чем точнее задача, тем проще оценить реальную ценность земли."]},{"id":4,"category":"ПОКУПКА","title":"Бюджет покупки: считаем больше, чем цену объекта","summary":"Как заранее учесть сопутствующие расходы и сохранить финансовый запас после переезда.","image":"https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1100&q=85","lead":"Цена в объявлении — только отправная точка. Реальный бюджет покупки складывается из нескольких частей, и лучше увидеть их до того, как вы внесёте аванс.","body":["Сначала определите верхнюю границу бюджета, при которой ежемесячные расходы останутся комфортными. Если планируется ипотека, учитывайте не только платёж, но и страховку, возможные изменения условий, коммунальные платежи и другие регулярные обязательства.","Заложите расходы на оформление и сопровождение сделки. Их состав зависит от способа покупки, вида объекта, условий кредитования и выбранных специалистов. До принятия решения запросите расчёт именно для вашей ситуации и уточните, какие услуги входят в стоимость.","Отдельной строкой запланируйте переезд и первые месяцы в новом месте. Даже квартира с готовой отделкой может потребовать мебели, техники, замены замков, небольшого ремонта или подключения услуг. Для дома добавляются расходы на обслуживание участка и инженерных систем.","Не направляйте весь доступный резерв на первоначальный взнос и цену объекта. Финансовая подушка помогает спокойно пройти период после покупки и не принимать поспешные решения из-за непредвиденных расходов.","Сравнивайте варианты по полной стоимости владения. Иногда объект с чуть более высокой ценой оказывается выгоднее благодаря состоянию, расположению и меньшим затратам на подготовку. Полезно составить таблицу расходов для двух-трёх вариантов и сравнить их на одинаковом горизонте."]},{"id":5,"category":"СДЕЛКА","title":"Документы без сюрпризов: что проверить до сделки","summary":"Проверка права собственности, оснований приобретения, ограничений и участников сделки.","image":"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1100&q=85","lead":"Спокойная сделка начинается задолго до подписания договора. Важно проверить не только сам объект, но и документы, полномочия и обстоятельства, которые могут повлиять на переход права.","body":["Первый шаг — подтвердить сведения об объекте и право продавца распоряжаться им. Сопоставьте данные документов с актуальными сведениями Единого государственного реестра недвижимости: адрес, кадастровый номер, площадь, собственник и зарегистрированные ограничения.","Изучите основание возникновения права собственности: договор купли-продажи, дарения, свидетельство о наследстве или иной документ. В зависимости от истории объекта могут потребоваться дополнительные документы и пояснения. Особое внимание уделите недавним переходам права и обстоятельствам, которые требуют отдельной юридической оценки.","Проверьте, кто участвует в сделке и на каком основании действует. Если используется представитель, важно удостовериться в действительности и объёме полномочий доверенности. В отдельных случаях имеют значение согласия супруга, разрешение органов опеки и другие документы.","Уточните, есть ли зарегистрированные обременения, аресты, ипотека, аренда или иные права третьих лиц. Если в объекте зарегистрированы жильцы или есть лица, сохраняющие право пользования, порядок решения этого вопроса должен быть понятен до подписания договора.","Не используйте универсальный список как замену проверке конкретной ситуации. Состав документов зависит от объекта и истории владения. При сложных обстоятельствах разумно привлечь профильного юриста и зафиксировать порядок расчётов, передачи объекта и подачи документов на регистрацию."]},{"id":6,"category":"РЕМОНТ","title":"Ремонт без хаоса: планируем до первого удара молотка","summary":"Последовательность работ, смета и резерв помогают удержать сроки и расходы под контролем.","image":"https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1100&q=85","lead":"Удачный ремонт начинается с решений на бумаге. Чем больше вопросов закрыто до начала работ, тем меньше переделок, задержек и незапланированных покупок.","body":["Начните с технического задания. Опишите, как будут использоваться комнаты, сколько нужно мест хранения, где расположатся бытовые приборы и рабочие зоны. Зафиксируйте обязательные требования и то, чем можно пожертвовать ради бюджета.","До закупки материалов согласуйте планировку, электрику, освещение, сантехнику и расположение оборудования. Эти решения связаны между собой: позднее изменение одной точки может повлечь переделку нескольких этапов.","Составьте смету по видам работ и материалам. Разделите обязательные расходы, желательные улучшения и декоративные покупки. Сравнивайте предложения подрядчиков по составу работ, материалам, срокам и условиям гарантии, а не только по итоговой цифре.","Продумайте последовательность: подготовительные и демонтажные работы, инженерные системы, черновая отделка, чистовые покрытия, установка дверей, мебели и оборудования. Конкретный порядок зависит от проекта, но его важно согласовать заранее.","Оставьте резерв времени и денег на непредвиденные обстоятельства. В старом фонде или при сложной перепланировке скрытые дефекты могут обнаружиться только после вскрытия конструкций. Фиксируйте изменения письменно и принимайте этапы работ до перехода к следующим."]},{"id":7,"category":"ПРОДАЖА","title":"Подготовка недвижимости к продаже: детали, которые работают","summary":"Как показать сильные стороны объекта, подготовить документы и организовать показы.","image":"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85","lead":"Покупатель оценивает не только площадь и адрес. На впечатление влияют состояние объекта, качество информации и то, насколько легко представить здесь свою жизнь.","body":["Начните с объективной оценки состояния. Устраните мелкие неисправности, проверьте сантехнику, освещение, ручки и двери. Необязательно делать дорогой ремонт перед продажей: часто аккуратность и чистота дают больше, чем попытка полностью обновить интерьер.","Подготовьте пространство к показу. Уберите лишние вещи с поверхностей, обеспечьте доступ дневному свету, проветрите комнаты и продумайте нейтральную обстановку. Фотографии должны честно передавать объект и его особенности, а не создавать ожидания, которые не подтвердятся при просмотре.","Соберите документы заранее и проверьте, совпадают ли сведения в них с фактическим состоянием объекта. Если были перепланировки или изменения, выясните, как они отражены в документах и какие действия могут потребоваться.","Определите аргументированную цену. Сравнивайте похожие объекты в том же районе, учитывая состояние, этаж, планировку, инфраструктуру и реальные отличия. Слишком высокая стартовая цена может уменьшить интерес, а слишком низкая — оставить без части потенциальной стоимости.","Продумайте порядок общения с покупателями: кто проводит показы, как отвечать на вопросы, какие условия сделки для вас приемлемы. Подготовленный сценарий помогает вести переговоры спокойно и не терять важные детали."]},{"id":8,"category":"ОБРАЗ ЖИЗНИ","title":"Район важнее, чем кажется: выбираем не только стены","summary":"Проверяем ежедневные маршруты, инфраструктуру, шум и сезонные особенности окружения.","image":"https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1100&q=85","lead":"Покупая недвижимость, вы выбираете не только помещение. Вы выбираете улицу, соседство и ежедневные маршруты, которые будут частью вашей жизни.","body":["Составьте карту повседневных маршрутов. Отметьте работу, школу, детский сад, магазины, медицинские учреждения, спорт и места отдыха. Посмотрите, сколько времени занимает дорога пешком, на автомобиле и общественном транспорте в часы пик.","Посетите район несколько раз. Утром и вечером могут отличаться загруженность дорог, уровень шума, парковочная ситуация и освещённость. Если возможно, загляните в будний день и в выходной.","Оцените инфраструктуру не по списку на карте, а по реальной доступности. Важно, безопасно ли идти пешком, есть ли удобные переходы, тротуары и остановки, насколько комфортно пользоваться нужными сервисами.","Обратите внимание на планы развития территории и соседние участки. Строительство новой дороги или жилого комплекса может изменить транспортную ситуацию, вид из окон и плотность застройки. Проверяйте доступную официальную информацию, а не только рекламные обещания.","Для загородной недвижимости добавьте сезонный взгляд: состояние дороги зимой, уборка снега, доступность служб, освещение и время поездки в непогоду. Район должен быть удобен не только в день просмотра, но и в обычный февральский вечер."]}];
  const journalTrack = document.getElementById("journalTrack");
  const journalModal = document.getElementById("propertyModal");
  const journalPrev = document.getElementById("journalPrev");
  const journalNext = document.getElementById("journalNext");
  const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function renderJournal() {
    if (!journalTrack) return;
    journalTrack.innerHTML = journalArticles.map(article =>
      '<article class="journal-card" data-article="' + article.id + '" tabindex="0" role="button" aria-label="Открыть статью: ' + escapeHtml(article.title) + '">' +
      '<div class="journal-photo" style="background-image:url(&quot;' + article.image + '&quot;)"></div>' +
      '<div class="journal-caption"><span>' + String(article.id).padStart(2,"0") + ' / ' + escapeHtml(article.category) + '</span><h3>' + escapeHtml(article.title) + '</h3><p>' + escapeHtml(article.summary) + '</p>' +
      '<span class="journal-read">Читать статью <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 12.5 12.5 3.5 M6 3.5h6.5V10"/></svg></span></div></article>'
    ).join("");
    const count = document.getElementById("journalCount");
    if (count) count.textContent = String(journalArticles.length).padStart(2,"0") + " МАТЕРИАЛОВ";
    updateJournalControls();
  }
  function updateJournalControls() {
    if (!journalTrack) return;
    const end = journalTrack.scrollWidth - journalTrack.clientWidth;
    if (journalPrev) journalPrev.disabled = journalTrack.scrollLeft <= 4;
    if (journalNext) journalNext.disabled = journalTrack.scrollLeft >= end - 4;
  }
  function openArticle(id) {
    const article = journalArticles.find(item => item.id === Number(id));
    if (!article) return;
    modalContent.innerHTML =
      '<div class="journal-modal-cover" style="background-image:url(&quot;' + article.image + '&quot;)"><span>' + String(article.id).padStart(2,"0") + ' / ' + escapeHtml(article.category) + '</span></div>' +
      '<div class="journal-modal-body"><div class="journal-meta">ЖУРНАЛ ПРОСТРАНСТВА / ХАУС-X</div><h2 id="modalTitle">' + escapeHtml(article.title) + '</h2><p class="journal-lead">' + escapeHtml(article.lead) + '</p>' +
      '<div class="journal-article-text">' + article.body.map(p => '<p>' + escapeHtml(p) + '</p>').join("") + '</div>' +
      '<div class="journal-article-note">Материал носит информационный характер. Решения по конкретному объекту принимайте после проверки документов и обстоятельств вашей ситуации.</div></div>';
    journalModal.classList.add("open");
    journalModal.setAttribute("aria-hidden","false");
    document.body.classList.add("no-scroll");
  }
  if (journalTrack) {
    journalTrack.addEventListener("click", event => {
      const card = event.target.closest("[data-article]");
      if (card) openArticle(card.dataset.article);
    });
    journalTrack.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-article]")) {
        event.preventDefault();
        openArticle(event.target.dataset.article);
      }
    });
    journalTrack.addEventListener("scroll", updateJournalControls, {passive:true});
    if (journalPrev) journalPrev.addEventListener("click", () => journalTrack.scrollBy({left:-journalTrack.clientWidth * .82,behavior:"smooth"}));
    if (journalNext) journalNext.addEventListener("click", () => journalTrack.scrollBy({left:journalTrack.clientWidth * .82,behavior:"smooth"}));
    window.addEventListener("resize", updateJournalControls);
    renderJournal();
  }

  // Back-to-top control appears after the visitor passes half of the page.
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("is-visible", window.scrollY > (document.documentElement.scrollHeight - window.innerHeight) / 2);
    };
    window.addEventListener("scroll", updateBackToTop, {passive:true});
    window.addEventListener("resize", updateBackToTop);
    backToTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
    updateBackToTop();
  }

  render();
})();