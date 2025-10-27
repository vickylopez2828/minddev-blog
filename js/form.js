const STORAGE_KEY = 'blogComments';

// Comentarios fake iniciales
const FAKE_COMMENTS = [
  {
    id: 1,
    author: 'Juana Rabuffetti',
    date: new Date('2025-10-25T14:30:00'),
    text: 'Me encanto este articulo, muy completo y cierto.',
    likes: 1,
    dislikes: 1,
    articleId: 1
  },
  {
    id: 2,
    author: 'Carlos Mendoza',
    date: new Date('2025-10-24T10:15:00'),
    text: '¡Muy útil! Justo lo que necesitaba para mi proyecto.',
    likes: 3,
    dislikes: 0,
    articleId: 2
  },
  {
    id: 3,
    author: 'Ana López',
    date: new Date('2025-10-23T16:45:00'),
    text: 'Excelente explicación, gracias por compartir.',
    likes: 2,
    dislikes: 0,
    articleId: 3
  }
];
//  FUNCIÓN PARA OBTENER ID DINÁMICAMENTE
function getCurrentArticleId() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get("id")) || 1;
}

// Obtener todos los comentarios
function getComments(articleId) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const localComments = saved[articleId] || [];
  const fakeComments = FAKE_COMMENTS.filter(c => c.articleId === articleId);
  
  return [...fakeComments, ...localComments]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Agregar comentario
function addComment(articleId, text) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  
  if (!saved[articleId]) saved[articleId] = [];
  
  const newComment = {
    id: Date.now(),
    author: 'Tú',
    date: new Date(),
    text: text,
    likes: 0,
    dislikes: 0,
    isLocal: true
  };
  
  saved[articleId].push(newComment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

// Formatear tiempo transcurrido
function getTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000); // segundos
  
  if (diff < 60) return 'Hace un momento';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
  if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} días`;
  return new Date(date).toLocaleDateString('es-ES');
}

// Renderizar comentarios
function renderComments(articleId, limit = 2) {
  const container = document.getElementById('comments-container');
  const comments = getComments(articleId);
  
  // Mostrar solo los primeros 'limit' comentarios
  const visibleComments = comments.slice(0, limit);
  const hasMore = comments.length > limit;
  
  container.innerHTML = visibleComments.map(comment => `
    <div class="flex gap-4 items-start w-full">
      <img src="./assets/icons/user-circle.svg" alt="user" class="w-6" />
      <div class="flex flex-col gap-2 w-full">
        <!-- seccion de comentario -->
        <div class="bg-[#161D3C] p-[10px] rounded flex flex-col gap-3">
          <div class="flex justify-between">
            <p class="text-xs sm:text-sm">${comment.author}</p>
            <span class="text-xs sm:text-sm hidden sm:block">${getTimeAgo(comment.date)}</span>
          </div>
          <p class="mb-4 text-sm sm:text-base">${comment.text}</p>
        </div>
        <!-- seccion de interacciones -->
        <div class="flex gap-4">
          <div class="flex gap-1">
            <button 
              class="cursor-pointer hover:scale-125 transition-transform">
              <img src="./assets/icons/like.svg" alt="like" class="w-[10px] sm:w-4" />
            </button>
            <span class="text-[8px] sm:text-xs">${comment.likes || 0}</span>
          </div>
          <div class="flex gap-1">
            <button 
              class="cursor-pointer hover:scale-125 transition-transform">
              <img src="./assets/icons/dislike.svg" alt="dislike" class="w-[10px] sm:w-4" />
            </button>
            <span class="text-[8px] sm:text-xs">${comment.dislikes || 0}</span>
          </div>
          <div class="flex gap-1">
            <button class="cursor-pointer hover:scale-125 transition-transform">
              <img src="./assets/icons/message-dots.svg" alt="response" class="w-[10px] sm:w-4" />
            </button>
            <span class="text-[8px] sm:text-xs">Responder</span>
          </div>
        </div>
      </div>
    </div>
  `).join('') + (hasMore ? `
    <button 
      onclick="showMoreComments('${articleId}')" 
      class="cursor-pointer text-xs sm:text-sm hover:underline hover:text-[#161D3C]">
      Ver más comentarios
    </button>
  ` : '');
}

// Mostrar más comentarios
let currentLimit = 2;
function showMoreComments(articleId) {
  currentLimit += 3;
  renderComments(getCurrentArticleId(), currentLimit);
}


// FUNCIÓN PARA ACTUALIZAR DESDE index.js 
function updateCommentsForArticle(newArticleId) {
  currentLimit = 2;
  renderComments(newArticleId, currentLimit);
}
// Hacer función global
window.updateCommentsForArticle = updateCommentsForArticle;

// Inicializar
renderComments(getCurrentArticleId());

// Manejar formulario
document.getElementById('comment-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const textarea = document.getElementById('comment');
  const text = textarea.value.trim();
  const error = document.getElementById("comment-error");

  if (!text) {
    error.classList.remove("hidden");
    return;
  }
  const currentArticleId = getCurrentArticleId();
  addComment(currentArticleId, text);
  textarea.value = '';
  error.classList.add('hidden')
  currentLimit = 2; 
  renderComments(currentArticleId, currentLimit);
  
  // Scroll suave al nuevo comentario
  // document.getElementById('comments-container').scrollIntoView({ 
  //   behavior: 'smooth' 
  // });
});
