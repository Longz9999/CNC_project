import {
  products,
  categories,
  formatVnd,
  stockLabel,
  SHIPPING_FREE_FROM,
  calculateOrderTotals,
} from "./catalog.js";

const $ = (selector) => document.querySelector(selector);
const productGrid = $("#product-grid");
const filterChips = $("#filter-chips");
const reduceMotionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const MAX_CART_QUANTITY = 99;
const COD_LIMIT = 20000000;

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const safeImageUrl = (value) =>
  typeof value === "string" && value.startsWith("https://images.unsplash.com/") ? value : "";
const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replaceAll("đ", "d")
    .toLowerCase()
    .trim();

// Batch DOM-heavy re-renders into a single frame so rapid input (typing, slider
// dragging) does not rebuild the whole grid dozens of times per second.
let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    renderProducts();
  });
}

// Drop observer references to nodes that are about to be replaced, otherwise the
// observer keeps the detached DOM (and its images) alive between renders.
function resetObservedMotion() {
  if (!motionObserver) return;
  observedMotion.forEach((el) => motionObserver.unobserve(el));
  observedMotion.clear();
}

// Build a one-time id → product index so cart lookups, render passes and the
// detail modal never scan the whole catalog repeatedly (O(1) instead of O(n)).
const productById = new Map(products.map((product) => [product.id, product]));

let activeCategory = "Tất cả";
let query = "";
let normalizedQuery = "";
let maxPrice = 5000000;
let sort = "featured";
let shippingZone = "inner-city";
let cart = loadCart();
let overlayReturnFocus = null;

const productSearchText = new Map(
  products.map((p) => [
    p.id,
    normalizeText(`${p.name} ${p.category} ${p.meta} ${p.sku} ${p.brand} ${p.description}`),
  ]),
);
function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem("cnc-cart") || "[]");
    if (!Array.isArray(stored)) return [];

    return stored.reduce((items, item) => {
      const product = productById.get(item?.id);
      const quantity = Number.parseInt(item?.quantity, 10);
      if (!product || !Number.isSafeInteger(quantity) || quantity <= 0) return items;
      const safeQuantity = Math.min(MAX_CART_QUANTITY, quantity);

      const existing = items.find(({ id }) => id === product.id);
      if (existing) existing.quantity = Math.min(MAX_CART_QUANTITY, existing.quantity + safeQuantity);
      else items.push({ id: product.id, quantity: safeQuantity });
      return items;
    }, []);
  } catch {
    return [];
  }
}
function saveCart() {
  try {
    localStorage.setItem("cnc-cart", JSON.stringify(cart));
  } catch {
    // Keep the in-memory cart usable when storage is unavailable.
  }
}
function renderChips() {
  if (!filterChips) return;
  filterChips.innerHTML = categories
    .map(
      (c) =>
        `<button type="button" class="chip ${activeCategory === c ? "active" : ""}" data-category="${escapeHtml(c)}" aria-pressed="${activeCategory === c}">${escapeHtml(c)}</button>`,
    )
    .join("");
}
function filtered() {
  // Hoist the normalized query out of the loop so `toLowerCase()` runs once per
  // filter pass instead of once per product (and one less allocation per item).
  const hasQuery = normalizedQuery.length > 0;
  let list = products.filter((p) => {
    if (activeCategory !== "Tất cả" && p.category !== activeCategory) return false;
    if (p.price > maxPrice) return false;
    if (!hasQuery) return true;
    return productSearchText.get(p.id)?.includes(normalizedQuery);
  });
  if (sort === "price-asc") list = list.slice().sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list = list.slice().sort((a, b) => b.price - a.price);
  return list;
}
function renderProducts() {
  if (!productGrid) return;
  let list = filtered();
  resetObservedMotion();
  productGrid.innerHTML = list
    .map((p) => {
      const badge = p.badge ? `<span class="product-badge">${escapeHtml(p.badge)}</span>` : "";
      const stockClass = p.stock <= 0 ? "is-wait" : p.stock <= 5 ? "is-low" : "";
      const addLabel = p.stock <= 0 ? "Đặt trước" : "Thêm";
      return `<article class="product-card">
        <button type="button" class="product-image is-loading" data-product="${escapeHtml(p.id)}" aria-label="Xem ${escapeHtml(p.name)}">
          <img src="${escapeHtml(safeImageUrl(p.image))}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" />
          ${badge}
        </button>
        <div class="product-info">
          <span class="product-category">${escapeHtml(p.category)}</span>
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          <p class="product-meta">${escapeHtml(p.meta)}</p>
          <p class="product-stock ${stockClass}">${escapeHtml(stockLabel(p.stock))} · ${escapeHtml(p.sku)}</p>
          <div class="product-bottom">
            <strong class="product-price">${formatVnd(p.price)}</strong>
            <button type="button" class="add-button" data-add="${escapeHtml(p.id)}" aria-label="${addLabel} ${escapeHtml(p.name)} vào giỏ">+</button>
          </div>
        </div>
      </article>`;
    })
    .join("");
  $("#empty-state").hidden = !!list.length;
  bindMotion();
}
let motionObserver;
const observedMotion = new Set();
function bindMotion() {
  const revealables = [
    ...document.querySelectorAll(
      ".product-card,.category-card,.trust-bar > div,.feature-copy,.feature-specs,.order-steps li,.policy-card",
    ),
  ];
  if (!("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    if (!motionObserver) {
      motionObserver = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              motionObserver.unobserve(entry.target);
            }
          }),
        {
          threshold: 0.12,
          rootMargin: "0px 0px -30px",
        },
      );
    }
    const revealableSet = new Set(revealables);
    observedMotion.forEach((el) => {
      if (!el.isConnected || !revealableSet.has(el)) {
        motionObserver.unobserve(el);
        observedMotion.delete(el);
      }
    });
    revealables.forEach((el) => {
      if (!observedMotion.has(el) && !el.classList.contains("is-visible")) {
        motionObserver.observe(el);
        observedMotion.add(el);
      }
    });
  }
  document.querySelectorAll(".product-image img").forEach((img) => {
    const frame = img.closest(".product-image");
    const loaded = () => {
      img.classList.add("is-loaded");
      img.classList.remove("is-error");
      frame?.classList.remove("is-loading");
      frame?.classList.remove("is-error");
    };
    const failed = () => {
      img.classList.add("is-error");
      frame?.classList.remove("is-loading");
      frame?.classList.add("is-error");
    };
    if (img.complete && img.naturalWidth > 0) loaded();
    else if (img.complete) failed();
    else
      img.addEventListener("load", loaded, {
        once: true,
      });
    img.addEventListener("error", failed, {
      once: true,
    });
  });
  document.querySelectorAll(".product-card").forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = "1";
    // Tilt + specular writes every pointer sample; throttle to one per frame
    // so hovering a card cannot flood the compositor between renders.
    let tiltFrame = 0;
    const frame = card.querySelector(".product-image");
    card.addEventListener("pointermove", (e) => {
      if (reduceMotionQuery.matches) return;
      if (e.pointerType && e.pointerType !== "mouse") return;
      if (tiltFrame) return;
      const clientX = e.clientX,
        clientY = e.clientY;
      tiltFrame = requestAnimationFrame(() => {
        tiltFrame = 0;
        if (!card.isConnected) return;
        const r = card.getBoundingClientRect();
        const x = (clientX - r.left) / r.width - 0.5;
        const y = (clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-5px)`;
        if (frame) {
          const imageRect = frame.getBoundingClientRect();
          const glintX = ((clientX - imageRect.left) / imageRect.width) * 100;
          const glintY = ((clientY - imageRect.top) / imageRect.height) * 100;
          frame.style.setProperty("--glint-x", `${Math.min(100, Math.max(0, glintX))}%`);
          frame.style.setProperty("--glint-y", `${Math.min(100, Math.max(0, glintY))}%`);
        }
      });
    });
    card.addEventListener("pointerleave", () => {
      if (tiltFrame) {
        cancelAnimationFrame(tiltFrame);
        tiltFrame = 0;
      }
      card.style.transform = "";
      frame?.style.removeProperty("--glint-x");
      frame?.style.removeProperty("--glint-y");
    });
  });
}
function animateAddButton(id) {
  const button = document.querySelector(`[data-add="${id}"]`);
  if (!button) return;
  button.classList.add("is-added");
  setTimeout(() => button.classList.remove("is-added"), 1500);
}
function flyToCart(id) {
  const source = document.querySelector(`[data-product="${id}"] img`);
  const target = $("#cart-open");
  if (!source || !target || reduceMotionQuery.matches) return;
  const clone = source.cloneNode();
  const from = source.getBoundingClientRect(),
    to = target.getBoundingClientRect();
  Object.assign(clone.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    objectFit: "cover",
    zIndex: 80,
    pointerEvents: "none",
    borderRadius: "4px",
    transition: "transform .65s cubic-bezier(.2,.8,.2,1), opacity .65s ease",
  });
  document.body.appendChild(clone);
  requestAnimationFrame(() => {
    const dx = to.left - from.left + to.width / 2 - from.width / 2;
    const dy = to.top - from.top + to.height / 2 - from.height / 2;
    clone.style.transform = `translate(${dx}px,${dy}px) scale(.18) rotate(12deg)`;
    clone.style.opacity = "0";
  });
  setTimeout(() => clone.remove(), 700);
}
function setupPageInteractions() {
  const header = $(".site-header");
  const reduceMotion = reduceMotionQuery;
  const backToTop = $("#back-to-top");
  let compact = false;
  // Single rAF-throttled scroll pipeline: header state, progress bar and the
  // back-to-top button all update once per frame instead of once per event.
  let scrollFrame = 0;
  let lastNavSection = null;
  const navSections = [...document.querySelectorAll("[data-nav-section]")]
    .map((a) => ({
      a,
      section: document.getElementById(a.dataset.navSection),
    }))
    .filter(({ section }) => section);
  const syncNavActive = () => {
    const items = navSections
      .map(({ a, section }) => ({
        a,
        section,
        top: section.getBoundingClientRect().top + window.scrollY,
      }))
      .sort((x, y) => x.top - y.top);
    if (!items.length) return;
    const headerH = header?.offsetHeight || 0;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const focusY = scrollY + Math.max(headerH + 24, innerHeight * 0.3);
    let current = null;
    for (const item of items) {
      if (item.top <= focusY) current = item.section;
    }
    const last = items[items.length - 1];
    if (maxScroll > 0 && scrollY >= maxScroll - 24) current = last.section;
    else if (last.section.getBoundingClientRect().top < innerHeight * 0.62) current = last.section;
    const nextId = current?.id || null;
    if (nextId === lastNavSection) return;
    lastNavSection = nextId;
    navSections.forEach(({ a, section }) => a.classList.toggle("is-active", section === current));
    dispatchEvent(new Event("nav-active"));
  };
  const applyScroll = () => {
    scrollFrame = 0;
    const next = scrollY > 24;
    if (next !== compact) {
      compact = next;
      header?.classList.toggle("is-compact", compact);
    }
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? Math.min(100, Math.max(0, (scrollY / max) * 100)) : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
    document.documentElement.style.setProperty("--back-progress", `${progress}%`);
    backToTop?.classList.toggle("is-visible", scrollY > 420);
    syncNavActive();
  };
  const onScroll = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(applyScroll);
  };
  addEventListener("scroll", onScroll, {
    passive: true,
  });
  addEventListener("resize", onScroll, {
    passive: true,
  });
  applyScroll();
  backToTop?.addEventListener("click", () => {
    backToTop.classList.add("is-returning");
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
    setTimeout(() => backToTop.classList.remove("is-returning"), 650);
  });
  const visual = $(".hero-visual");
  const heroProduct = visual?.querySelector(".hero-product");
  // Hover parallax writes layout-affecting styles, so coalesce it to one write
  // per frame and reuse the cached media query instead of building one per move.
  let visualFrame = 0;
  visual?.addEventListener("pointermove", (e) => {
    if (visualFrame) return;
    const clientX = e.clientX,
      clientY = e.clientY;
    visualFrame = requestAnimationFrame(() => {
      visualFrame = 0;
      const r = visual.getBoundingClientRect();
      visual.style.setProperty("--spot-x", `${clientX - r.left}px`);
      visual.style.setProperty("--spot-y", `${clientY - r.top}px`);
      if (heroProduct && !reduceMotion.matches) {
        const shiftX = (clientX - r.left - r.width / 2) / 45;
        const shiftY = (clientY - r.top - r.height / 2) / 55;
        heroProduct.style.animationPlayState = "paused";
        heroProduct.style.transform = `rotate(5deg) translate(${shiftX}px,${shiftY}px)`;
      }
    });
  });
  visual?.addEventListener("pointerleave", () => {
    if (visualFrame) {
      cancelAnimationFrame(visualFrame);
      visualFrame = 0;
    }
    if (heroProduct) {
      heroProduct.style.animationPlayState = "running";
      heroProduct.style.transform = "";
    }
  });
  // Pause every infinite CSS animation while the tab is hidden so the browser
  // can release compositor layers and GPU memory instead of animating offscreen.
  document.addEventListener("visibilitychange", () => {
    document.documentElement.classList.toggle("is-page-hidden", document.hidden);
  });
  $("#announcement-close")?.addEventListener("click", () =>
    $("#announcement").classList.add("is-dismissed"),
  );
  const contentSections = document.querySelectorAll("main > section");
  if ("IntersectionObserver" in window) {
    const viewObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-in-view", entry.isIntersecting);
        }),
      {
        rootMargin: "0px",
      },
    );
    contentSections.forEach((section) => viewObserver.observe(section));
  } else {
    contentSections.forEach((section) => section.classList.add("is-in-view"));
  }
}
function renderCart() {
  let count = cart.reduce((n, i) => n + i.quantity, 0);
  $("#cart-count").textContent = count;
  $("#cart-heading-count").textContent = count;
  const mobileCartCount = $("#mobile-cart-count");
  if (mobileCartCount) mobileCartCount.textContent = count;
  let items = cart
    .map((i) => ({
      ...i,
      product: productById.get(i.id),
    }))
    .filter(({ product }) => product);
  const cartRows = items
    .map(({ product, quantity }) => {
      const lineTotal = formatVnd(product.price * quantity);
      return `<div class="cart-row" data-row="${product.id}">
        <div class="cart-item">
          <img src="${escapeHtml(safeImageUrl(product.image))}" alt="" loading="lazy" decoding="async" />
          <div>
            <h3>${escapeHtml(product.name)}</h3>
            <small>${formatVnd(product.price)} / sản phẩm</small>
            <div class="qty-control">
              <button type="button" data-qty="${product.id}" data-delta="-1" aria-label="Giảm số lượng ${escapeHtml(product.name)}">−</button>
              <span>${quantity}</span>
              <button type="button" data-qty="${product.id}" data-delta="1" aria-label="Tăng số lượng ${escapeHtml(product.name)}">+</button>
            </div>
            <button type="button" class="remove-item" data-remove="${product.id}" aria-label="Xóa ${escapeHtml(product.name)} khỏi giỏ">Xóa</button>
          </div>
          <strong class="cart-item-price">${lineTotal}</strong>
        </div>
      </div>`;
    })
    .join("");
  const list = $("#cart-items");
  list.classList.toggle("is-clearing", false);
  list.innerHTML = items.length
    ? `<div class="cart-tools"><button type="button" class="clear-cart" id="clear-cart">Xóa tất cả</button></div>${cartRows}`
    : `<div class="cart-empty"><div>⌁</div><p>Giỏ hàng đang trống.</p><small>Thêm một vài dụng cụ để bắt đầu.</small></div>`;
  const subtotal = items.reduce((n, i) => n + i.product.price * i.quantity, 0);
  const totals = calculateOrderTotals(subtotal, { shippingZone: "inner-city" });
  const progress = Math.min(100, Math.round((subtotal / SHIPPING_FREE_FROM) * 100));
  $("#shipping-progress-value").textContent = `${progress}%`;
  $("#shipping-progress-bar").style.width = `${progress}%`;
  $("#shipping-progress-copy").textContent =
    subtotal >= SHIPPING_FREE_FROM
      ? "Đã đạt miễn phí vận chuyển"
      : `Còn ${formatVnd(Math.max(0, SHIPPING_FREE_FROM - subtotal))} để được miễn phí vận chuyển`;
  $("#cart-subtotal").textContent = formatVnd(subtotal);
  $("#cart-shipping").textContent = subtotal ? totals.shippingLabel : "—";
  $("#cart-total").textContent = formatVnd(totals.total);
  $("#checkout-open").disabled = !items.length;
  $("#checkout-open").setAttribute("aria-disabled", String(!items.length));
}
function addToCart(id) {
  const product = productById.get(id);
  if (!product) return;
  let item = cart.find((i) => i.id === id);
  if (item && item.quantity >= MAX_CART_QUANTITY) {
    toast(`Tối đa ${MAX_CART_QUANTITY} sản phẩm mỗi mã`);
    return;
  }
  if (item) item.quantity++;
  else
    cart.push({
      id,
      quantity: 1,
    });
  saveCart();
  renderCart();
  animateAddButton(id);
  flyToCart(id);
  openCart();
  toast(
    product && product.stock <= 0
      ? "Đã ghi đặt trước — kho sẽ gọi xác nhận ngày về"
      : "Đã thêm sản phẩm vào giỏ hàng",
  );
}
function changeQuantity(id, delta) {
  let item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity = Math.min(MAX_CART_QUANTITY, item.quantity + delta);
  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  renderCart();
}
function finishRemoval(ids) {
  cart = cart.filter((i) => !ids.includes(i.id));
  saveCart();
  renderCart();
}
function animateRowsOut(rows, done) {
  if (!rows.length || reduceMotionQuery.matches) {
    done();
    return;
  }
  const list = $("#cart-items");
  rows.forEach((row, index) => {
    row.style.transitionDelay = `${index * 70}ms`;
    row.classList.add("is-leaving");
  });
  let pending = rows.length;
  const step = () => {
    pending -= 1;
    if (pending <= 0) done();
  };
  rows.forEach((row) =>
    row.addEventListener(
      "transitionend",
      (event) => {
        if (event.target === row && event.propertyName === "grid-template-rows") step();
      },
      { once: true },
    ),
  );
  setTimeout(
    () => {
      if (list?.querySelector(".is-leaving")) done();
    },
    560 + rows.length * 70,
  );
}
function removeFromCart(id) {
  const row = document.querySelector(`.cart-row[data-row="${id}"]`);
  if (!row || row.classList.contains("is-leaving")) {
    if (!row) finishRemoval([id]);
    return;
  }
  animateRowsOut([row], () => {
    finishRemoval([id]);
    toast("Đã xóa sản phẩm");
  });
}
function clearCart() {
  if (!cart.length) return;
  const rows = [...document.querySelectorAll(".cart-row:not(.is-leaving)")];
  $("#cart-items")?.classList.add("is-clearing");
  animateRowsOut(rows, () => {
    finishRemoval(cart.map((item) => item.id));
    toast("Đã xóa toàn bộ giỏ hàng");
  });
}
function openCart() {
  const drawer = $("#cart-drawer");
  if (!drawer.classList.contains("open")) overlayReturnFocus = document.activeElement;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  $("#cart-open")?.setAttribute("aria-expanded", "true");
  $("#mobile-cart-open")?.setAttribute("aria-expanded", "true");
  $("#scrim").classList.add("visible");
  document.body.style.overflow = "hidden";
  drawer.querySelector("[data-close-cart]")?.focus();
}
function closeCart() {
  const drawer = $("#cart-drawer");
  const wasOpen = drawer.classList.contains("open");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  $("#cart-open")?.setAttribute("aria-expanded", "false");
  $("#mobile-cart-open")?.setAttribute("aria-expanded", "false");
  $("#scrim").classList.remove("visible");
  if (!document.querySelector(".modal-wrap.open")) document.body.style.overflow = "";
  if (!wasOpen) return;
  const restore = overlayReturnFocus;
  overlayReturnFocus = null;
  if (restore?.isConnected && !restore.disabled) restore.focus();
  else $("#cart-open")?.focus();
}
function showProduct(id) {
  let p = productById.get(id);
  if (!p) return;
  const wait = p.stock <= 0;
  const specRows = Object.entries(p.specs)
    .map(([k, v]) => `<div><span>${escapeHtml(k)}</span><strong>${escapeHtml(v)}</strong></div>`)
    .join("");
  const cuttingRow = p.cutting
    ? `<div><span>Chế độ cắt</span><strong>${escapeHtml(p.cutting)}</strong></div>`
    : "";
  const stockClass = wait ? "is-wait" : p.stock <= 5 ? "is-low" : "";
  const actionLabel = wait ? "Đặt trước" : "Thêm vào giỏ";
  $("#product-modal-content").innerHTML = `<div class="product-modal-grid">
    <img src="${escapeHtml(safeImageUrl(p.image))}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" />
    <div class="modal-copy">
      <span class="product-category">${escapeHtml(p.category)}</span>
      <h2 id="modal-product-title">${escapeHtml(p.name)}</h2>
      <p class="product-meta">${escapeHtml(p.sku)} · ${escapeHtml(p.brand)} · ${escapeHtml(p.origin)}</p>
      <p>${escapeHtml(p.description)}</p>
      <p class="product-stock ${stockClass}">${escapeHtml(stockLabel(p.stock))} · ${escapeHtml(p.lead)}</p>
      <div class="spec-list">${specRows}${cuttingRow}</div>
      <div class="modal-price">${formatVnd(p.price)}<small> / ${escapeHtml(p.unit)} · chưa VAT</small></div>
      <button type="button" class="button button-primary button-full" data-add="${escapeHtml(p.id)}">${actionLabel} <span>→</span></button>
    </div>
  </div>`;
  const productModal = $("#product-modal");
  productModal?.setAttribute("aria-labelledby", "modal-product-title");
  openModal(productModal);
}
function openModal(el) {
  if (!el) return;
  overlayReturnFocus = document.activeElement;
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  el.querySelector(".modal-close")?.focus();
}
function focusableIn(root) {
  return [...root.querySelectorAll(
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
  )].filter((el) => !el.hidden && el.getClientRects().length > 0);
}
function closeModals() {
  const openModals = [...document.querySelectorAll(".modal-wrap.open")];
  if (!openModals.length) return;
  openModals.forEach((m) => {
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    if (m.id === "product-modal") m.setAttribute("aria-labelledby", "modal-product-name");
  });
  if (!$("#cart-drawer")?.classList.contains("open")) document.body.style.overflow = "";
  const restore = overlayReturnFocus;
  overlayReturnFocus = null;
  if (restore?.isConnected && !restore.disabled) restore.focus();
  else $("#cart-open")?.focus();
}
function cartTotals(options = {}) {
  const items = cart
    .map((i) => ({ ...i, product: productById.get(i.id) }))
    .filter(({ product }) => product);
  const subtotal = items.reduce((n, i) => n + i.product.price * i.quantity, 0);
  return { items, ...calculateOrderTotals(subtotal, options) };
}
function updateCheckoutSummary() {
  const form = $("#checkout-form");
  const summary = $("#checkout-summary");
  if (!form || !summary) return;
  const wantsVat = Boolean(form.elements.vat?.checked);
  shippingZone = form.elements.shippingZone?.value || "inner-city";
  const { items, subtotal, shippingLabel, vat, total } = cartTotals({
    vat: wantsVat,
    shippingZone,
  });
  const count = items.reduce((n, i) => n + i.quantity, 0);
  summary.innerHTML = `<div><dt>Hàng</dt><dd>${count} món</dd></div>
    <div><dt>Tạm tính</dt><dd>${formatVnd(subtotal)}</dd></div>
    <div><dt>Vận chuyển</dt><dd>${shippingLabel}</dd></div>
    <div><dt>VAT 8%</dt><dd>${vat ? formatVnd(vat) : "Không"}</dd></div>
    <div class="summary-total"><dt>Thanh toán</dt><dd>${formatVnd(total)}${shippingZone === "other-province" ? " + phí ship" : ""}</dd></div>`;

  const cod = form.querySelector('[name="payment"][value="cod"]');
  if (cod) {
    cod.disabled = total > COD_LIMIT;
    if (cod.disabled && cod.checked) {
      const transfer = form.querySelector('[value="transfer"]');
      if (transfer) transfer.checked = true;
    }
  }
  $("#cod-note")?.classList.toggle("is-visible", total > COD_LIMIT);
}
function openCheckout() {
  if (!cart.length) return;
  closeCart();
  const form = $("#checkout-form");
  const layout = $("#checkout-modal .checkout-layout");
  const success = $("#checkout-success");
  form?.reset();
  shippingZone = form?.elements.shippingZone?.value || "inner-city";
  if (layout) layout.hidden = false;
  if (success) success.hidden = true;
  updateCheckoutSummary();
  openModal($("#checkout-modal"));
}
function toast(msg) {
  let t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const header = $(".site-header");
  const offset = (header?.getBoundingClientRect().height || 0) + 18;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  document.documentElement.classList.add("is-navigating");
  window.scrollTo({
    top,
    behavior: reduceMotionQuery.matches ? "auto" : "smooth",
  });
  setTimeout(() => document.documentElement.classList.remove("is-navigating"), 650);
}
function bindSectionLinks() {
  const nav = $(".main-nav");
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  let hoveredLink = null;
  const clearHover = () => navLinks.forEach((item) => item.classList.remove("is-hovered"));
  const moveIndicator = (link) => {
    if (!link || !nav) return;
    const navRect = nav.getBoundingClientRect(),
      linkRect = link.getBoundingClientRect();
    nav.style.setProperty("--nav-indicator-left", `${linkRect.left - navRect.left}px`);
    nav.style.setProperty("--nav-indicator-width", `${linkRect.width}px`);
    nav.classList.add("has-indicator");
  };
  const restoreIndicator = () => {
    const current = hoveredLink || navLinks.find((item) => item.classList.contains("is-active"));
    if (current) moveIndicator(current);
    else nav?.classList.remove("has-indicator");
  };
  const sweepIn = (link) => {
    if (!nav || !link) return;
    moveIndicator(link);
    nav.classList.remove("is-sweep-retract", "is-sweep-enter");
    void nav.offsetWidth;
    nav.classList.add("is-sweep-enter");
    nav.addEventListener("animationend", () => nav.classList.remove("is-sweep-enter"), {
      once: true,
    });
  };
  const retractThenRestore = () => {
    const current = navLinks.find((item) => item.classList.contains("is-active"));
    if (current) {
      nav?.classList.remove("is-sweep-enter", "is-sweep-retract");
      restoreIndicator();
      return;
    }
    if (!nav?.classList.contains("has-indicator")) return;
    nav.classList.remove("is-sweep-enter", "is-sweep-retract");
    void nav.offsetWidth;
    nav.classList.add("is-sweep-retract");
    nav.addEventListener(
      "animationend",
      () => {
        nav.classList.remove("is-sweep-retract");
        if (!hoveredLink) restoreIndicator();
      },
      {
        once: true,
      },
    );
  };
  navLinks.forEach((link) => {
    const activate = () => {
      hoveredLink = link;
      clearHover();
      link.classList.add("is-hovered");
      sweepIn(link);
    };
    link.addEventListener("pointerenter", activate);
    link.addEventListener("focus", activate);
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      navLinks.forEach((item) => item.classList.remove("is-active"));
      hoveredLink = link;
      clearHover();
      link.classList.add("is-active", "is-hovered");
      sweepIn(link);
      nav?.classList.remove("open");
      $("#menu-toggle")?.setAttribute("aria-expanded", "false");
      scrollToSection(id);
    });
    link.addEventListener("blur", () => link.classList.remove("is-hovered"));
  });
  nav?.addEventListener("pointerleave", () => {
    hoveredLink = null;
    clearHover();
    retractThenRestore();
  });
  addEventListener("nav-active", () => {
    if (!hoveredLink) restoreIndicator();
  });
  addEventListener("resize", () => {
    const current = hoveredLink || navLinks.find((item) => item.classList.contains("is-active"));
    if (current) moveIndicator(current);
  });
  document.querySelectorAll('a[href^="#"]:not(.main-nav a)').forEach((link) =>
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToSection(id);
    }),
  );
}
filterChips.addEventListener("click", (e) => {
  let b = e.target.closest("[data-category]");
  if (!b) return;
  activeCategory = b.dataset.category;
  renderChips();
  scheduleRender();
  scrollToSection("products");
});
document.querySelectorAll(".category-card").forEach((b) =>
  b.addEventListener("click", () => {
    activeCategory = b.dataset.category;
    renderChips();
    scheduleRender();
    scrollToSection("products");
  }),
);
$("#product-search").addEventListener("input", (e) => {
  query = e.target.value;
  normalizedQuery = normalizeText(query);
  scheduleRender();
});
$("#sort-select").addEventListener("change", (e) => {
  sort = e.target.value;
  scheduleRender();
});
$("#price-range").addEventListener("input", (e) => {
  maxPrice = +e.target.value;
  $("#price-output").textContent = formatVnd(maxPrice);
  scheduleRender();
});
$("#clear-filters").addEventListener("click", () => {
  activeCategory = "Tất cả";
  query = "";
  normalizedQuery = "";
  maxPrice = 5000000;
  $("#product-search").value = "";
  $("#price-range").value = maxPrice;
  $("#price-output").textContent = formatVnd(maxPrice);
  renderChips();
  scheduleRender();
});
document.addEventListener("click", (e) => {
  let add = e.target.closest("[data-add]");
  if (add) {
    const inModal = Boolean(e.target.closest(".modal-wrap"));
    if (inModal) closeModals();
    addToCart(add.dataset.add);
  }
  let p = e.target.closest("[data-product]");
  if (p) showProduct(p.dataset.product);
  let qty = e.target.closest("[data-qty]");
  if (qty) changeQuantity(qty.dataset.qty, +qty.dataset.delta);
  let rem = e.target.closest("[data-remove]");
  if (rem) removeFromCart(rem.dataset.remove);
  if (e.target.closest("#clear-cart")) clearCart();
});
$("#cart-open").addEventListener("click", openCart);
$("[data-close-cart]").addEventListener("click", closeCart);
$("#scrim").addEventListener("click", closeCart);
$("#checkout-open").addEventListener("click", openCheckout);
document.querySelectorAll(".modal-close").forEach((b) => b.addEventListener("click", closeModals));
document.querySelectorAll(".modal-wrap").forEach((m) =>
  m.addEventListener("click", (e) => {
    if (e.target === m) closeModals();
  }),
);
const menuToggle = $("#menu-toggle");
const mainNav = $(".main-nav");
document.addEventListener("keydown", (e) => {
  const activeOverlay = document.querySelector(".modal-wrap.open") || $("#cart-drawer.open");
  if (activeOverlay && e.key === "Tab") {
    const focusables = focusableIn(activeOverlay);
    if (focusables.length) {
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  if (e.key === "Escape") {
    closeCart();
    closeModals();
    mainNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});
menuToggle?.addEventListener("click", () => {
  const open = mainNav?.classList.toggle("open") || false;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
});
function focusProductSearch() {
  const search = $("#product-search");
  if (!search) return;
  search.scrollIntoView({
    behavior: reduceMotionQuery.matches ? "auto" : "smooth",
    block: "center",
  });
  setTimeout(() => search.focus(), 250);
}
$(".search-toggle")?.addEventListener("click", focusProductSearch);
$("#mobile-search-open")?.addEventListener("click", focusProductSearch);
$("#mobile-cart-open")?.addEventListener("click", openCart);
const checkoutForm = $("#checkout-form");
checkoutForm?.taxId?.addEventListener("input", (e) => {
  e.target.setCustomValidity("");
});
checkoutForm?.addEventListener("input", (e) => {
  if (e.target.name === "vat" || e.target.name === "shippingZone") updateCheckoutSummary();
});
checkoutForm?.addEventListener("change", (e) => {
  if (e.target.name === "vat" || e.target.name === "shippingZone" || e.target.name === "payment") {
    if (e.target.name === "vat") checkoutForm.taxId?.setCustomValidity("");
    updateCheckoutSummary();
  }
});
checkoutForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  form.taxId?.setCustomValidity("");
  form.phone?.setCustomValidity("");
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const wantsVat = Boolean(form.elements.vat?.checked);
  const phoneDigits = String(data.get("phone") || "").replace(/\D/g, "");
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    form.phone.setCustomValidity("Nhập số điện thoại hợp lệ");
    form.reportValidity();
    return;
  }
  if (wantsVat && !String(data.get("taxId") || "").trim()) {
    form.taxId.setCustomValidity("Nhập MST để xuất hóa đơn");
    form.reportValidity();
    return;
  }
  const zone = form.elements.shippingZone?.value || "inner-city";
  const { items, subtotal, shipping, shippingLabel, vat, total } = cartTotals({
    vat: wantsVat,
    shippingZone: zone,
  });
  if (!items.length) {
    closeModals();
    return;
  }
  const pay = data.get("payment") === "transfer" ? "Chuyển khoản" : "COD";
  if (pay === "COD" && total > COD_LIMIT) {
    toast("Đơn trên 20 triệu cần chuyển khoản");
    return;
  }
  const order = "MK" + Math.floor(100000 + Math.random() * 899999);
  const record = {
    id: order,
    at: new Date().toISOString(),
    name: data.get("name"),
    phone: data.get("phone"),
    address: data.get("address"),
    payment: pay,
    vat: Boolean(data.get("vat")),
    taxId: data.get("taxId") || "",
    shippingZone: zone,
    shippingLabel,
    note: data.get("note") || "",
    lines: items.map(({ product, quantity }) => ({
      sku: product.sku,
      name: product.name,
      quantity,
      price: product.price,
    })),
    subtotal,
    shipping,
    vatAmount: vat,
    total,
  };
  try {
    const prev = JSON.parse(localStorage.getItem("cnc-orders") || "[]");
    localStorage.setItem(
      "cnc-orders",
      JSON.stringify([record, ...(Array.isArray(prev) ? prev : [])].slice(0, 20)),
    );
  } catch {
    // Demo order still confirms when storage is blocked.
  }
  const success = $("#checkout-success");
  if (success) {
    success.hidden = false;
    $("#checkout-order-id").textContent = order;
    $("#checkout-order-payment").textContent = pay;
    $("#checkout-order-total").textContent = formatVnd(record.total);
    $("#checkout-order-note").textContent =
      pay === "Chuyển khoản"
        ? `CK Vietcombank 0123 456 789 · nội dung ${order}. Kỹ thuật viên sẽ gọi xác nhận trong ít phút.`
        : "Thanh toán khi nhận hàng. Kỹ thuật viên sẽ gọi xác nhận trong ít phút.";
    $("#checkout-modal .checkout-layout").hidden = true;
    success.querySelector("[data-success-close]")?.focus();
  }
  cart = [];
  saveCart();
  renderCart();
});
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-success-close]")) closeModals();
});
renderChips();
renderProducts();
renderCart();
setupPageInteractions();
bindSectionLinks();
