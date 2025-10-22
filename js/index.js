async function fetchArticleData() {
    try {
        const response = await fetch('../data/data.js');
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const dataArray = await response.json();
        // Acceder al primer elemento del array
        const data = dataArray[0];
        displayArticle(data);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        const container = document.getElementById('article-container');
        container.innerHTML = '<p>Error al cargar el contenido.</p>';
    }
}

function displayArticle(content) {
    const container = document.getElementById('article-container');
    container.innerHTML = '';
    
    content.articleContent.forEach(item => {
        let element;
        
        // Manejar diferentes tipos de elementos
        switch(item.tag) {
            case 'ul':
                // Crear lista desordenada
                element = document.createElement('ul');
                if (item.ariaLabel) {
                    element.setAttribute('aria-label', item.ariaLabel);
                }
                
                // Agregar items de la lista
                if (item.items && Array.isArray(item.items)) {
                    item.items.forEach(listItem => {
                        const li = document.createElement('li');
                        li.textContent = listItem;
                        element.appendChild(li);
                    });
                }
                break;
                
            case 'aside':
                // Crear elemento aside para tips
                element = document.createElement('aside');
                element.className = 'tip-minddev';
                element.setAttribute('role', 'note');
                element.setAttribute('aria-label', 'Consejo de MindDev');
                
                const tipContent = document.createElement('p');
                tipContent.textContent = item.content;
                element.appendChild(tipContent);
                break;
                
            default:
                // Para h1, h2, h3, p, etc.
                element = document.createElement(item.tag);
                element.textContent = item.content;
                if (item.id) {
                    element.id = item.id;
                }
                break;
        }
        
        container.appendChild(element);
    });
}

// Llamar la función
document.addEventListener('DOMContentLoaded', fetchArticleData);