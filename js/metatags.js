// js/metatags.js
function generateHeadHTML(meta) {
    return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta name="keywords" content="${meta.keywords}" />
    <meta name="author" content="MindDev Perú" />
    <meta property="og:title" content="${meta.ogTitle}" />
    <meta property="og:description" content="${meta.ogDescription}" />
    <meta property="og:image" content="${meta.ogImage}" />
    <meta property="og:url" content="${meta.ogUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="es_PE" />
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${meta.schemaHeadline}",
        "description": "${meta.schemaDescription}",
        "author": {
            "@type": "Organization",
            "name": "MindDev Perú"
        },
        "publisher": {
            "@type": "Organization",
            "name": "MindDev Perú",
            "logo": {
                "@type": "ImageObject",
                "url": "https://minddevperu.com/assets/images/logo.png"
            }
        },
        "datePublished": "${meta.schemaDatePublished}",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${meta.ogUrl}"
        }
    }
    </script>
    `;
}

function updateMetaTags(articleData) {
    if (articleData && articleData.metaTags) {
        const newMetaTags = generateHeadHTML(articleData.metaTags);
        
        // Remover metatags existentes dinámicos para evitar duplicados
        const existingMetaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], script[type="application/ld+json"]');
        existingMetaTags.forEach(tag => tag.remove());
        
        // Remover título existente
        const existingTitle = document.querySelector('title');
        if (existingTitle) existingTitle.remove();
        
        // Agregar los nuevos metatags al head
        document.head.innerHTML = newMetaTags + document.head.innerHTML;
        
        console.log('Metatags actualizados para:', articleData.metaTags.title);
    }
}