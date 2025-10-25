document.addEventListener("DOMContentLoaded", () => {
    const slideContainer = document.getElementById("articles-container");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    // Cantidad de desplazamiento
    const scrollAmount = 420;

    // Eventos de clic en las flechas
    btnNext.addEventListener("click", () => {
        slideContainer.scrollBy({   
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    btnPrev.addEventListener("click", () => {
        slideContainer.scrollBy({ 
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
});