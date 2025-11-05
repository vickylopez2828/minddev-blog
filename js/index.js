// js/index.js
async function fetchArticleData(articleId) {
  try {
    const response = await fetch("../data/data.json");

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const dataArray = await response.json();

    const data = dataArray.find((article) => article.id === articleId);
    if (!data) {
      throw new Error("Artículo no encontrado");
    }
    window.history.pushState({ articleId }, "", `?id=${articleId}`);

    // ACTUALIZAR METATAGS DINÁMICOS
    if (typeof updateMetaTags === 'function') {
        updateMetaTags(data);
    }

    // ACTUALIZAR HEADER DINÁMICO
    if (typeof updateHeader === 'function') {
        updateHeader(data);
    }

    setupNavigation(articleId, dataArray.length);
    displayArticle(data);
    
    // Generar índice si la función existe
    if (typeof generateArticleIndex === 'function') {
        generateArticleIndex();
    }
    if (typeof updateCommentsForArticle === 'function') {
        updateCommentsForArticle(articleId);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Error fetching data:", error);
    const container = document.getElementById("article-container");
    container.innerHTML = "<p>Error al cargar el contenido.</p>";
  }
}

function setupNavigation(currentId, totalArticles) {
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  if (prevButton) {
    const newPrevButton = prevButton.cloneNode(true);
    prevButton.parentNode.replaceChild(newPrevButton, prevButton);

    if (currentId > 1) {
      newPrevButton.textContent = "Artículo Anterior";
      newPrevButton.style.opacity = "1";
      newPrevButton.style.pointerEvents = "auto";
      newPrevButton.removeAttribute("href");
      newPrevButton.addEventListener("click", (e) => {
        e.preventDefault();
        fetchArticleData(currentId - 1);
      });
    } else {
      newPrevButton.href = "/";
      newPrevButton.textContent = "Inicio";
    }
  }

  if (nextButton) {
    const newNextButton = nextButton.cloneNode(true);
    nextButton.parentNode.replaceChild(newNextButton, nextButton);

    if (currentId < totalArticles) {
      newNextButton.textContent = "Artículo Siguiente";
      newNextButton.style.opacity = "1";
      newNextButton.style.pointerEvents = "auto";
      newNextButton.removeAttribute("href");
      newNextButton.addEventListener("click", (e) => {
        e.preventDefault();
        fetchArticleData(currentId + 1);
      });
    } else {
      newNextButton.textContent = "Artículo Siguiente";
      newNextButton.style.opacity = "0.5";
      newNextButton.style.pointerEvents = "none";
    }
  }
}

function displayArticle(content) {
  const container = document.getElementById("article-container");
  container.innerHTML = "";

  content.articleContent.forEach((item) => {
    let element;

    // Manejar diferentes tipos de elementos
    switch (item.tag) {
      case "ul":
        // Crear lista desordenada
        element = document.createElement("ul");
        if (item.ariaLabel) {
          element.setAttribute("aria-label", item.ariaLabel);
        }

        // Agregar items de la lista
        if (item.items && Array.isArray(item.items)) {
          item.items.forEach((listItem) => {
            const li = document.createElement("li");
            li.innerHTML = marked.parseInline(listItem);
            element.appendChild(li);
          });
        }
        break;

      case "aside":
        // Crear elemento aside para tips CON ICONO
        element = document.createElement("aside");
        element.className = "tip-minddev";
        element.setAttribute("role", "note");
        element.setAttribute("aria-label", "Consejo de MindDev");

        // Crear contenedor para el contenido del tip
        const tipContent = document.createElement("div");
        tipContent.className = "tip-content";
        
        // Agregar icono si existe
        if (item.icon && item.icon.content) {
          const iconElement = document.createElement(item.icon.tag || "img");
          iconElement.className = "tip-icon";
          iconElement.src = item.icon.content;
          iconElement.alt = "Icono MindDev";
          element.appendChild(iconElement);
        }

        // Agregar texto del tip
        const tipText = document.createElement("p");
        tipText.innerHTML = marked.parseInline(item.content);
        tipContent.appendChild(tipText);
        
        element.appendChild(tipContent);
        break;

      case "table":
        // Crear tabla con cabecera y cuerpo
        element = document.createElement("table");
        if (item.ariaLabel) {
          element.setAttribute("aria-label", item.ariaLabel);
        }
        element.className = "minddev-table";

        // Crear encabezado
        if (item.headers && Array.isArray(item.headers)) {
          const thead = document.createElement("thead");
          const headerRow = document.createElement("tr");
          item.headers.forEach((header) => {
            const th = document.createElement("th");  
            th.innerHTML = marked.parseInline(header);
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          element.appendChild(thead);
        }

        // Crear cuerpo
        if (item.rows && Array.isArray(item.rows)) {
          const tbody = document.createElement("tbody");
          item.rows.forEach((row) => {
            const tr = document.createElement("tr");
            row.forEach((cell) => {
              const td = document.createElement("td");
              td.innerHTML = marked.parse(cell);
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
          element.appendChild(tbody);
        }
        break;
      default:
        // Para h1, h2, h3, p, etc.
        element = document.createElement(item.tag);
        element.innerHTML = marked.parseInline(item.content);
        if (item.id) {
          element.id = item.id;
        }
        break;
    }

    container.appendChild(element);
  });
}

// En index.js - Agregar esta función
function updateHeader(articleData) {
    const heroBannerContent = document.querySelector('#hero-banner-content');
    if (!heroBannerContent || !articleData) return;

    const { clasification, articleTitle, author, 'date-published': fechaPublicacion, 'time-of-reading': tiempoLectura } = articleData;
    
    // Formatear fecha
    const fecha = new Date(fechaPublicacion);
    const opciones = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

    // Actualizar el hero banner
    heroBannerContent.innerHTML = `
        <div class="flex items-center gap-2 bg-minddev-primary px-3 py-2 rounded-3xl w-fit">
            <img src="${clasification.image}" alt="${clasification.title}" class="w-4 h-4 lg:w-5 lg:h-5 text-electric-blue">
            <p class="font-semibold text-electric-blue">${clasification.title}</p>
        </div>
        <div class="flex">
            <h1 class="text-2xl lg:text-4xl font-bold text-white">${articleTitle.content}</h1>
        </div>
        <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 text-white">
            <div class="flex items-center gap-1 sm:gap-3">
                <img src="${author['image-autor']}" alt="${author['name-author']}" class="w-6 h-6 rounded-full">
                <span class="text-[11px] sm:text-sm">${author['name-author']}</span>
                <span class="text-[11px] sm:text-sm lg:inline">|</span>
                <span class="text-[11px] sm:text-sm lg:inline">Última actualización</span>
                <span class="text-[11px] sm:text-sm">${fechaFormateada}</span>
            </div>
            <div class="flex justify-between">
              <div class="flex items-center gap-2 bg-minddev-primary px-3 py-1 rounded-lg w-fit">
                  <img src="./assets/icons/clock-three.svg" alt="Tiempo de lectura" class="w-4 h-4">
                  <span class="text-[10px] sm:text-sm text-white">${tiempoLectura}</span>
              </div>
              <div class="ml-3 flex items-center gap-1 md:hidden">
                  <a href="https://www.linkedin.com/company/minddev-peru" target="_black" class="bg-minddev-primary p-2 rounded-lg shadow-[0_4px_10px_1px_rgba(0,0,0,0.25)] text-white hover:text-electric-blue transition-transform duration-300 hover:scale-110">
                  <!-- linkedin svg pequeño -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  </a>
                  <a href="https://www.facebook.com/minddev.peru" target="_black" class="bg-minddev-primary p-2 rounded-lg shadow-[0_4px_10px_1px_rgba(0,0,0,0.25)] text-white hover:text-electric-blue transition-transform duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  </a>
                  <a href="https://www.instagram.com/minddevperu/" target="_black" class="bg-minddev-primary p-2 rounded-lg shadow-[0_4px_10px_1px_rgba(0,0,0,0.25)] text-white hover:text-electric-blue transition-transform duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                  </a>
                  <a href="https://x.com/MinddevPeru" target="_black" class="bg-minddev-primary p-2 rounded-lg shadow-[0_4px_10px_1px_rgba(0,0,0,0.25)] text-white hover:text-electric-blue transition-transform duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  </a>
              </div>
            </div>
        </div>
    `;
}

// Hacerla disponible globalmente
window.updateHeader = updateHeader;
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.articleId) {
    fetchArticleData(event.state.articleId);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = parseInt(urlParams.get("id")) || 1;
  fetchArticleData(articleId);
});

// Hacer funciones disponibles globalmente si es necesario
window.fetchArticleData = fetchArticleData;
window.setupNavigation = setupNavigation;
window.displayArticle = displayArticle;