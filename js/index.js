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

    document.title = data.title || "Blog - MindDev";

    setupNavigation(articleId, dataArray.length);
    displayArticle(data);
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
            li.innerHTML = marked.parse(listItem);
            // li.textContent = listItem;
            element.appendChild(li);
          });
        }
        break;

      case "aside":
        // Crear elemento aside para tips
        element = document.createElement("aside");
        element.className = "tip-minddev";
        element.setAttribute("role", "note");
        element.setAttribute("aria-label", "Consejo de MindDev");

        const tipContent = document.createElement("p");
        tipContent.innerHTML = marked.parse(item.content);
        // tipContent.textContent = item.content;
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
            th.textContent = header;
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
        element.innerHTML = marked.parse(item.content);
        if (item.id) {
          element.id = item.id;
        }
        break;
    }

    container.appendChild(element);
  });
}

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
