// article-index.js 
(function () {
  // Config
  const ARTICLE_CONTAINER_ID = "article-container";
  const DESKTOP_INDEX_ID = "index-list";
  const MOBILE_INDEX_ID = "mobile-index-list";
  const HEADER_ID = "main-header";
  const ACTIVE_CLASS_DESKTOP = "text-electric-blue font-bold";
  const ACTIVE_CLASS_MOBILE = "bg-electric-blue/20 text-electric-blue";

  let isScrolling = false;
  let scrollTimer;

  // Utility: slugify 
  function slugify(text) {
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "") || "section";
  }

  // ensureHeadingIds 
  function ensureHeadingIds(container) {
    const headings = container.querySelectorAll("h1, h2, h3, h4");
    const used = new Set();
    
    headings.forEach((h, idx) => {
      let base = h.id || slugify(h.textContent || `heading-${idx}`);
      let id = base;
      let counter = 1;
      
      while (document.getElementById(id) || used.has(id)) {
        id = `${base}-${counter++}`;
      }
      
      h.id = id;
      used.add(id);
      h.setAttribute("data-index-depth", h.tagName.toLowerCase().replace("h", ""));
    });
    
    return Array.from(headings);
  }

  // Scroll suavizado
  function scrollToElementWithOffset(targetEl) {
    const header = document.getElementById(HEADER_ID);
    const headerOffset = header ? header.offsetHeight + 8 : 12;
    const rect = targetEl.getBoundingClientRect();
    const top = rect.top + window.scrollY - headerOffset;
    
    window.scrollTo({ top, behavior: "smooth" });
  }

  // buildIndex 
  function buildIndex(headings) {
    const desktopContainer = document.getElementById(DESKTOP_INDEX_ID);
    const mobileContainer = document.getElementById(MOBILE_INDEX_ID);

    if (desktopContainer) desktopContainer.innerHTML = "";
    if (mobileContainer) mobileContainer.innerHTML = "";

    const fragmentDesktop = document.createDocumentFragment();
    const fragmentMobile = document.createDocumentFragment();

    headings.forEach((h) => {
      const depth = parseInt(h.getAttribute("data-index-depth") || "2", 10);
      const text = h.textContent.trim();
      const id = h.id;

      // Desktop item
      if (desktopContainer) {
        const li = document.createElement("div");
        li.className = "index-item cursor-pointer py-1 text-sm";
        li.style.marginLeft = `${(depth - 1) * 10}px`;
        li.style.lineHeight = "1.4";
        li.setAttribute("data-target", id);
        li.setAttribute("role", "link");
        li.tabIndex = 0;
        li.innerText = text;
        li.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.getElementById(id);
          if (target) {
            scrollToElementWithOffset(target);
          }
        });
        fragmentDesktop.appendChild(li);
      }

      // Mobile item
      if (mobileContainer) {
        const btn = document.createElement("button");
        btn.className = "index-item-mobile whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium mr-3";
        btn.setAttribute("data-target", id);
        btn.innerText = text;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.getElementById(id);
          if (target) {
            scrollToElementWithOffset(target);
          }
        });
        fragmentMobile.appendChild(btn);
      }
    });

    if (desktopContainer) desktopContainer.appendChild(fragmentDesktop);
    if (mobileContainer) mobileContainer.appendChild(fragmentMobile);
  }

  // CORRECIÓN PRINCIPAL: Observer optimizado
  function setupActiveObserver(headings) {
    const desktopContainer = document.getElementById(DESKTOP_INDEX_ID);
    const mobileContainer = document.getElementById(MOBILE_INDEX_ID);
    const desktopItems = desktopContainer ? Array.from(desktopContainer.querySelectorAll("[data-target]")) : [];
    const mobileItems = mobileContainer ? Array.from(mobileContainer.querySelectorAll("[data-target]")) : [];

    let currentActive = null;

    function clearActive() {
      desktopItems.forEach((el) => {
        el.classList.remove(...ACTIVE_CLASS_DESKTOP.split(" "));
      });
      mobileItems.forEach((el) => {
        el.classList.remove(...ACTIVE_CLASS_MOBILE.split(" "));
      });
    }

    function setActive(id) {
      if (currentActive === id) return;
      
      clearActive();
      currentActive = id;

      const desktopMatch = desktopItems.find((it) => it.dataset.target === id);
      const mobileMatch = mobileItems.find((it) => it.dataset.target === id);

      if (desktopMatch) {
        desktopMatch.classList.add(...ACTIVE_CLASS_DESKTOP.split(" "));
      }
      if (mobileMatch) {
        mobileMatch.classList.add(...ACTIVE_CLASS_MOBILE.split(" "));
        // REMOVIDO: scrollIntoView que causaba el bloqueo
        // mobileMatch.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }

    const header = document.getElementById(HEADER_ID);
    const offset = header ? header.offsetHeight + 4 : 4;

    // Configuración más permisiva del Observer
    const observer = new IntersectionObserver(
      (entries) => {
        // Encontrar la entrada que más se acerca al top
        let mostVisible = null;
        let minTop = Infinity;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const top = entry.boundingClientRect.top;
            if (top < minTop) {
              minTop = top;
              mostVisible = entry.target;
            }
          }
        });

        if (mostVisible) {
          setActive(mostVisible.id);
        }
      },
      {
        root: null,
        rootMargin: `-${offset}px 0px -60% 0px`, // Más espacio abajo
        threshold: 0.1 // Threshold más bajo
      }
    );

    headings.forEach((h) => observer.observe(h));
  }

  // Main function
  function generateArticleIndex() {
    const container = document.getElementById(ARTICLE_CONTAINER_ID);
    if (!container) return;
    
    const headings = ensureHeadingIds(container);
    if (!headings.length) {
      const d = document.getElementById(DESKTOP_INDEX_ID);
      const m = document.getElementById(MOBILE_INDEX_ID);
      if (d) d.innerHTML = "<p class='text-sm text-gray-400'>No hay secciones.</p>";
      if (m) m.innerHTML = "";
      return;
    }
    
    buildIndex(headings);
    setupActiveObserver(headings);
  }

  window.generateArticleIndex = generateArticleIndex;

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      try {
        generateArticleIndex();
      } catch (e) {
        console.error("Error generating index:", e);
      }
    }, 100);
  });
})();