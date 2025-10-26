// js/header-updater.js
function updateHeader(articleData) {
    try {
        // Actualizar banner del header
        const heroBanner = document.querySelector('.hero-banner');
        if (heroBanner && articleData['header-banner']) {
            const bannerPath = `${articleData['header-banner']}.png`;
            heroBanner.style.backgroundImage = `url(${bannerPath})`;
            
            // Precargar imagen para evitar flickering
            preloadImage(bannerPath);
        }

        // Actualizar información del artículo
        updateArticleInfo(articleData);
    } catch (error) {
        console.error('Error updating header:', error);
    }
}

function updateArticleInfo(articleData) {
    const infoContainer = document.querySelector('.hero-banner section:last-child');
    if (!infoContainer) {
        console.warn('Info container not found');
        return;
    }

    try {
        // Limpiar contenido existente
        infoContainer.innerHTML = '';

        // Crear elementos solo si los datos existen
        const items = [];

        if (articleData.clasification) {
            items.push(createInfoItem(
                articleData.clasification.image,
                articleData.clasification.title,
                'clasification'
            ));
        }

        if (articleData['date-published']) {
            items.push(createInfoItem(
                './assets/icons/calendar.svg',
                formatDate(articleData['date-published']),
                'date'
            ));
        }

        if (articleData['time-of-reading']) {
            items.push(createInfoItem(
                './assets/icons/clock-three.svg',
                articleData['time-of-reading'],
                'time'
            ));
        }

        // Agregar todos los items al container
        items.forEach(item => infoContainer.appendChild(item));

    } catch (error) {
        console.error('Error updating article info:', error);
    }
}

function createInfoItem(iconSrc, text, type) {
    const div = document.createElement('div');
    const baseClasses = 'flex bg-accent-purple p-1 lg:p-5 gap-2 lg:gap-4 rounded-full items-center scale-90 justify-center';
    
    // Ajustar ancho según el tipo de información
    const widthClasses = {
        'clasification': 'w-44 lg:w-52',
        'date': 'w-40 lg:w-44',
        'time': 'w-48 lg:w-48'
    };

    div.className = `${baseClasses} ${widthClasses[type]}`;

    div.innerHTML = `
        <img class="size-7" src="${iconSrc}" alt="${type}" />
        <p class="text-xs lg:text-sm">${text}</p>
    `;

    return div;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

function preloadImage(src) {
    const img = new Image();
    img.src = src;
}

// Hacer la función disponible globalmente
window.updateHeader = updateHeader;