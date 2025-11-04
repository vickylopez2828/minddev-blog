const heroBannerContent = document.querySelector('#hero-banner-content');

async function cargarDatosBlog() {
    try {
        const respuesta = await fetch('../data/data.json');
        
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error cargando el blog:', error);
        return null;
    }
}

// Función para mostrar la clasificación en el hero banner
async function mostrarClasificacionEnHero() {
    const datos = await cargarDatosBlog();
    
    if (!datos || !datos[0]) return;
    
    const primerArticulo = datos[0];
    const clasificacion = primerArticulo.clasification;
    const titulo = primerArticulo.articleTitle.content; 
    const authorImage = primerArticulo.author['image-autor'];
    const authorName = primerArticulo.author['name-author'];
    const fechaPublicacion = new Date(primerArticulo['date-published']);
    const opciones = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    const fechaFormateada = fechaPublicacion.toLocaleDateString('es-ES', opciones);
    const tiempoLectura = primerArticulo['time-of-reading'];
    
        // Crear el HTML para la clasificación
    heroBannerContent.innerHTML = `
        <div class="flex items-center gap-2 bg-minddev-primary px-3 py-2 rounded-3xl w-fit">
            <img src="${clasificacion.image}" alt="${clasificacion.title}" class="w-4 h-4 lg:w-5 lg:h-5">
            <p class="font-semibold text-white">${clasificacion.title}</p>
        </div>
        <div class="flex">
            <h1 class="text-2xl lg:text-4xl font-bold text-white">${titulo}</h1>
        </div>
        <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 text-white items-start">
            <div class="flex items-center gap-3">
                <img src="${authorImage}" alt="${authorName}" class="w-6 h-6 rounded-full">
                <span class="text-sm">${authorName}</span>
                <span class="text-sm hidden lg:inline">|</span>
                <span class="text-sm hidden lg:inline">Última actualización</span>
                <span class="text-sm">${fechaFormateada}</span>
            </div>
            <div class="flex items-center gap-2 bg-minddev-primary px-3 py-1 rounded-lg w-fit">
                <img src="./assets/icons/clock-three.svg" alt="Tiempo de lectura" class="w-4 h-4">
                <span class="text-sm text-white">${tiempoLectura}</span>
            </div>
        </div>
    `;
}

// Llamar la función
mostrarClasificacionEnHero();