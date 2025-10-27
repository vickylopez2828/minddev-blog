# 🚀 Blog MindDev - Rediseño

#### Más que un blog, una experiencia digital transformadora ✨

Proyecto colaborativo que redefine la excelencia en blogs tecnológicos, combinando diseño cutting-edge con contenido de alto valor. Desarrollado para líderes, emprendedores y apasionados de la tecnología que buscan insights accionables y una experiencia de usuario premium.

Cada artículo es una inmersión cuidadosamente diseñada - desde la navegación intuitiva y el rendimiento optimizado hasta el SEO avanzado y la interactividad inteligente. Un espacio donde el contenido técnico se encuentra con la elegancia del diseño moderno.

## 👥 Equipo

### UX/UI Designers

- Juana Rabuffetti
- Verónica Montenegro

### Frontend Developers

- Andrea Junes
- Alejo Daniel Almirón
- Victoria López

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)
- Tailwind CSS 3.4.17 (CDN)
- Lucide Icons

## 📁 Estructura del Proyecto

```
minddev-blog/
├── index.html                 # Página principal del blog
├── css/                       # Estilos CSS
│   ├── _base.css             # Estilos base e imports
│   ├── _idioma.css           # Estilos del selector de idioma
│   ├── _whatsapp.css         # Estilos del botón WhatsApp
│   ├── _scrollbar.css        # Personalización de scrollbars
│   ├── _indice.css           # Estilos del índice del artículo
│   ├── _hero-banner.css      # Estilos del banner hero
│   └── _article-styles.css   # Estilos del contenido del artículo
├── js/                        # Funcionalidades JavaScript
│   ├── index.js              # Lógica principal del blog
│   ├── metatags.js           # Gestión dinámica de meta tags
│   ├── header-updater.js     # Actualización dinámica del header
│   ├── form.js               # Manejo de formularios y comentarios
│   ├── card.js               # Generación de tarjetas de artículos
│   ├── slide.js              # Funcionalidad de slider/carrusel
│   └── article-index.js      # Generación del índice del artículo
├── data/                      # Datos del blog
│   ├── data.json             # Contenido de los artículos
│   └── cardData.json         # Datos para tarjetas de artículos
└── assets/                    # Recursos multimedia
    ├── images/               # Imágenes del blog
    │   ├── logo-header.png   # Logo del header
    │   ├── favicon_64.ico    # Favicon
    │   ├── hero-banner.png   # Banner principal
    │   └── banner-*.png      # Banners de artículos
    └── icons/                # Iconos SVG
        ├── chevron-*.svg     # Iconos de navegación
        ├── share-*.svg       # Iconos de redes sociales
        ├── user-circle.svg   # Icono de usuario
        └── *.svg             # Otros iconos
```

## 🚀 Instalación y Uso

### Requisitos Previos

- Navegador web moderno
- Servidor web local (opcional, para desarrollo)

### Instalación Local

1. **Clonar o descargar el proyecto:**

   ```bash
   git clone <url-del-repositorio>
   cd minddev-blog
   ```

2. **Ejecutar en servidor local (recomendado):**

   ```bash
   # Con Python
   python -m http.server 8000

   # Con Node.js
   npx http-server

   # Con PHP
   php -S localhost:8000
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:8000
   ```

### Uso Directo

- Abrir `index.html` directamente en el navegador
- La aplicación funciona completamente en el lado del cliente

## 🎯 Funcionalidades Principales

### Navegación entre Artículos

- Navegación secuencial entre artículos
- URLs dinámicas con parámetros `?id=`
- Historial de navegación

### Sistema de Comentarios

- Comentarios persistentes en localStorage
- Comentarios de ejemplo predefinidos
- Interfaz de likes/dislikes
- Formato de tiempo relativo

### Índice Interactivo

- Generación automática del índice
- Navegación suave entre secciones
- Indicador visual de sección activa
- Versión responsive para móviles

### SEO Optimizado

- Meta tags dinámicos por artículo
- Datos estructurados (Schema.org)
- Open Graph tags para redes sociales
- URLs canónicas

### Compartir en Redes Sociales

- Botones para LinkedIn, Twitter, Email
- Función de compartir nativa del navegador
- URLs preconfiguradas

### Newsletter

- Formulario de suscripción
- Validación de email
- Enlaces a políticas de privacidad

## 🔧 Configuración

### Personalización de Colores

Los colores están configurados en `index.html` dentro de la configuración de Tailwind:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "deep-blue": "#0f172a", // Fondo principal
        "electric-blue": "#3b82f6", // Color principal
        "dark-alt": "#0f1a37", // Fondo secundario
        "accent-purple": "#5355dd", // Acento secundario
        "white-pure": "#ffffff", // Texto principal
      },
    },
  },
};
```

### Gestión de Contenido

Los artículos se gestionan mediante archivos JSON en la carpeta `data/`:

- `data.json`: Contenido completo de los artículos
- `cardData.json`: Información para las tarjetas de "Más artículos"

## 📱 Características Responsive

- Diseño mobile-first
- Navegación adaptativa
- Índice móvil con scroll horizontal
- Imágenes responsive
- Tipografía escalable

## 🎨 Componentes de Interfaz

### Header

- Logo navegable
- Botón de inicio
- Selector de idioma (ES/EN)
- Navegación sticky

### Hero Banner

- Imagen de fondo dinámica
- Información del artículo (categoría, fecha, tiempo de lectura)
- Navegación entre artículos

### Contenido del Artículo

- Títulos con IDs automáticos
- Tablas estilizadas
- Tips destacados con iconos
- Listas estructuradas

### Sidebar

- Índice del artículo
- Botones de compartir
- Tarjetas de artículos relacionados

### Footer

- Información de contacto
- Enlaces legales
- Redes sociales
- Botón de WhatsApp flotante

## 🔗 Links Importantes

- **Diseño Figma:** [https://www.figma.com/design/VV7QNzh7C9BjDap0xXsXdU/Blog-MindDev?node-id=1-4&p=f]
- **Deploy:** [https://mind-dev-blog.netlify.app/?id=1]
- **Notion:** [https://www.notion.so/Documentaci-n-T-cnica-292c7926e4b58098affcf053221edcce?source=copy_link]

## 📝 Scripts JavaScript

### index.js

- Carga dinámica de artículos
- Navegación entre contenido
- Gestión del estado de la aplicación

### metatags.js

- Actualización dinámica de meta tags
- Datos estructurados para SEO
- Open Graph tags

### header-updater.js

- Actualización del banner del artículo
- Información de categoría y fecha
- Precarga de imágenes

### form.js

- Gestión de comentarios
- localStorage integration
- Validación de formularios

### card.js

- Generación de tarjetas de artículos
- Carga desde JSON
- Diseño responsive

### slide.js

- Funcionalidad de carrusel
- Navegación con flechas
- Scroll suavizado

### article-index.js

- Generación automática del índice
- Scroll spy para secciones activas
- Navegación suave

## 🚀 Características Técnicas

- **Performance:** Carga optimizada de recursos
- **Accesibilidad:** ARIA labels y navegación por teclado
- **SEO:** Meta tags dinámicos y estructura semántica
- **Responsive:** Diseño adaptable a todos los dispositivos
- **Offline:** Funcionalidad básica sin conexión
