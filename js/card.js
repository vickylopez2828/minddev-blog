// funcion para obtener datos del JSON y mostrar las tarjetas
async function fetchCardData() {
    try {
        const response = await fetch("../data/cardData.json");
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const dataArray = await response.json();
        displayCards(dataArray);
    } catch (error) {
        console.error("Error fetching data:", error);
        const container = document.getElementById("more-articles");
        container.innerHTML = "<p>Error al cargar el contenido.</p>";
    }
}

function createCard(data) {
    // Clonar el primer article
    const template = document.querySelector(".card-article");
    const card = template.cloneNode(true);
    card.classList.remove("hidden");

    // Llenar los datos
    const cardIcon = card.querySelector(".card-icon");
    const cardCategory = card.querySelector(".card-category");
    const cardTitle = card.querySelector(".card-title");
    const cardDescription = card.querySelector(".card-description");
    const cardLink = card.querySelector(".card-link");
    
    cardIcon.src = `/assets/icons/${data.icon}.svg` || "";
    cardIcon.alt = data.title || "Icono del artículo";
    cardCategory.textContent = data.category || "Categoría";
    cardTitle.textContent = data.title || "Título del artículo";
    cardDescription.textContent = data.description || "Descripción";
    cardLink.href = data.link || "#";
    
    return card;
}

function displayCards(dataArray) {
    const container = document.getElementById("articles-container");
    // crear y agregar cada tarjeta al contenedor
    dataArray.forEach(articleData => {
        const card = createCard(articleData);
        container.appendChild(card);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    fetchCardData();
});