const STORAGE_KEY = 'blogComments';
const REACTIONS_KEY = 'blogReactions';

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

// Sistema anti-spam
const SPAM_KEYWORDS = [
  'comprar', 'oferta', 'descuento', 'barato', 'gratis', 'ganar dinero',
  'trabajo desde casa', 'click aquí', 'visita nuestro sitio', 'http://',
  'www.', '.com', 'apuesta', 'casino', 'préstamo', 'seguro', 'inversión'
];

// Generar ID de usuario único para el navegador
function getUserId() {
  let userId = localStorage.getItem('blogUserId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('blogUserId', userId);
  }
  return userId;
}

// FUNCIÓN PARA OBTENER ID DINÁMICAMENTE
function getCurrentArticleId() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get("id")) || 1;
}

// Obtener reacciones del usuario
function getUserReactions() {
  return JSON.parse(localStorage.getItem(REACTIONS_KEY)) || {};
}

// Guardar reacciones del usuario
function saveUserReactions(reactions) {
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(reactions));
}

// Obtener reacción del usuario para un comentario específico
function getUserReaction(commentId) {
  const reactions = getUserReactions();
  return reactions[commentId] || null;
}

// Manejar reacción (like/dislike)
function handleReaction(commentId, reactionType) {
  const reactions = getUserReactions();
  const currentReaction = reactions[commentId];
  
  // Obtener comentarios para actualizar contadores
  const articleId = getCurrentArticleId();
  const comments = getComments(articleId);
  const comment = comments.find(c => c.id === commentId);
  
  if (!comment) return;
  
  // Si ya tenía esta reacción, quitarla
  if (currentReaction === reactionType) {
    delete reactions[commentId];
    if (reactionType === 'like') {
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.dislikes = Math.max(0, comment.dislikes - 1);
    }
  } 
  // Si tenía una reacción diferente, cambiarla
  else if (currentReaction) {
    // Restar la reacción anterior
    if (currentReaction === 'like') {
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.dislikes = Math.max(0, comment.dislikes - 1);
    }
    
    // Agregar la nueva reacción
    reactions[commentId] = reactionType;
    if (reactionType === 'like') {
      comment.likes += 1;
    } else {
      comment.dislikes += 1;
    }
  }
  // Si no tenía reacción previa, agregar la nueva
  else {
    reactions[commentId] = reactionType;
    if (reactionType === 'like') {
      comment.likes += 1;
    } else {
      comment.dislikes += 1;
    }
  }
  
  // Guardar cambios
  saveUserReactions(reactions);
  updateCommentInStorage(articleId, comment);
  renderComments(articleId, currentLimit);
}

// Actualizar comentario en el almacenamiento
function updateCommentInStorage(articleId, updatedComment) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  
  if (saved[articleId]) {
    const index = saved[articleId].findIndex(c => c.id === updatedComment.id);
    if (index !== -1) {
      saved[articleId][index] = updatedComment;
    }
  }
  
  // También buscar en comentarios fake
  const fakeIndex = FAKE_COMMENTS.findIndex(c => c.id === updatedComment.id && c.articleId === articleId);
  if (fakeIndex !== -1) {
    FAKE_COMMENTS[fakeIndex] = updatedComment;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

// Detección de spam
function isSpam(text) {
  const lowerText = text.toLowerCase();
  
  // Detectar palabras clave de spam
  const spamCount = SPAM_KEYWORDS.filter(keyword => 
    lowerText.includes(keyword)
  ).length;
  
  // Detectar enlaces (potencial spam)
  const linkRegex = /(http|www|\.com|\.net|\.org)/gi;
  const hasLinks = linkRegex.test(lowerText);
  
  // Detectar contenido repetitivo
  const words = text.split(' ');
  const uniqueWords = [...new Set(words)];
  const repetitionRatio = uniqueWords.length / words.length;
  
  // Si tiene más de 2 palabras de spam, enlaces o alta repetición
  return spamCount > 2 || hasLinks || repetitionRatio < 0.4;
}

// Obtener todos los comentarios
function getComments(articleId) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const localComments = saved[articleId] || [];
  const fakeComments = FAKE_COMMENTS.slice(0, 2);
  
  return [...fakeComments, ...localComments]
    .sort((a, b) => new Date(b.date) - new Date(a.date));//ordena de mas nuevo a mas viejo
}

// Agregar comentario
function addComment(articleId, author, text) {
  // Validar contra spam
  if (isSpam(text)) {
    showSpamNotice();
    return false;
  }
  
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  
  if (!saved[articleId]) saved[articleId] = [];
  
  const newComment = {
    id: Date.now(),
    author: author,
    date: new Date(),
    text: text,
    likes: 0,
    dislikes: 0,
    isLocal: true
  };
  
  saved[articleId].push(newComment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return true;
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

// Mostrar advertencia de spam
function showSpamNotice() {
  // Crear o mostrar notificación de spam
  let spamNotice = document.getElementById('spam-notice');
  if (!spamNotice) {
    spamNotice = document.createElement('div');
    spamNotice.id = 'spam-notice';
    spamNotice.className = 'bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4';
    spamNotice.innerHTML = `
      <strong class="font-bold">¡Cuidado!</strong>
      <span class="block sm:inline"> Tu comentario parece spam. Si es legítimo, intenta reescribirlo de manera más natural.</span>
    `;
    
    const form = document.getElementById('comment-form');
    form.parentNode.insertBefore(spamNotice, form);
  }
  
  spamNotice.classList.remove('hidden');
  
  // Ocultar después de 5 segundos
  setTimeout(() => {
    spamNotice.classList.add('hidden');
  }, 5000);
}

// Renderizar comentarios
function renderComments(articleId, limit = 2) {
  const container = document.getElementById('comments-container');
  const comments = getComments(articleId);
  
  // Mostrar solo los primeros 'limit' comentarios
  const visibleComments = comments.slice(0, limit);
  const hasMore = comments.length > limit;
  
  container.innerHTML = visibleComments.map(comment => {
    const userReaction = getUserReaction(comment.id);
    
    return `
    <div class="flex gap-4 items-start w-full mb-6">
      <div class="flex-shrink-0">
        <div class="w-10 h-10 rounded-full bg-[#151E3D] flex items-center justify-center">
          <img src="./assets/icons/user.svg" alt="user" class="w-5 h-5" />
        </div>
      </div>
      <div class="flex flex-col gap-2 w-full">
        <!-- seccion de comentario -->
        <div class="bg-[#151E3D] p-4 rounded-lg shadow-lg border-none">
          <div class="flex justify-between items-start mb-2">
            <p class="text-sm font-medium text-white">${comment.author}</p>
            <span class="text-xs text-gray-400">${getTimeAgo(comment.date)}</span>
          </div>
          <p class="text-white text-sm leading-relaxed">${comment.text}</p>
        </div>
        <!-- seccion de interacciones -->
        <div class="flex gap-4 mt-2">
          <div class="flex gap-1 items-center">
            <button 
              onclick="handleReaction(${comment.id}, 'like')"
              class="flex items-center gap-1 cursor-pointer transition-all ${userReaction === 'like' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}">
              ${userReaction === 'like' ? 
                `<svg width="16" height="16" viewBox="0 0 10 10" fill="#3498db" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.05823 4.21053H8.36339C9.42431 4.21053 8.04519 8.75 7.28536 8.75H2.06804C1.84628 8.75 1.6665 8.57328 1.6665 8.35526V4.44486C1.6665 4.30041 1.74676 4.16748 1.87576 4.09832C2.73478 3.6377 3.74286 3.26008 4.24135 2.37794L4.77501 1.43364C4.83905 1.32029 4.96058 1.25 5.09248 1.25C6.41744 1.25 6.02437 3.17908 5.8443 3.94615C5.81255 4.08141 5.91703 4.21053 6.05823 4.21053Z" stroke="#3498db" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>` :
                `<svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.05823 4.21053H8.36339C9.42431 4.21053 8.04519 8.75 7.28536 8.75H2.06804C1.84628 8.75 1.6665 8.57328 1.6665 8.35526V4.44486C1.6665 4.30041 1.74676 4.16748 1.87576 4.09832C2.73478 3.6377 3.74286 3.26008 4.24135 2.37794L4.77501 1.43364C4.83905 1.32029 4.96058 1.25 5.09248 1.25C6.41744 1.25 6.02437 3.17908 5.8443 3.94615C5.81255 4.08141 5.91703 4.21053 6.05823 4.21053Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
              }
              <span class="text-xs">${comment.likes || 0}</span>
            </button>
          </div>
          <div class="flex gap-1 items-center">
            <button 
              onclick="handleReaction(${comment.id}, 'dislike')"
              class="flex items-center gap-1 cursor-pointer transition-all ${userReaction === 'dislike' ? 'text-red-400' : 'text-gray-400 hover:text-white'}">
              ${userReaction === 'dislike' ?
                `<svg width="16" height="16" viewBox="0 0 10 10" fill="#e74c3c" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.35811 5.78947H2.05296C0.99203 5.78947 2.37115 1.25 3.13098 1.25H8.3483C8.57006 1.25 8.74984 1.42672 8.74984 1.64474V5.55514C8.74984 5.69959 8.66958 5.83252 8.54058 5.90168C7.68156 6.3623 6.67348 6.73992 6.17499 7.62206L5.64133 8.56636C5.57729 8.67971 5.45576 8.75 5.32386 8.75C3.9989 8.75 4.39197 6.82092 4.57205 6.05385C4.60379 5.91859 4.49931 5.78947 4.35811 5.78947Z" stroke="#e74c3c" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>` :
                `<svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.35811 5.78947H2.05296C0.99203 5.78947 2.37115 1.25 3.13098 1.25H8.3483C8.57006 1.25 8.74984 1.42672 8.74984 1.64474V5.55514C8.74984 5.69959 8.66958 5.83252 8.54058 5.90168C7.68156 6.3623 6.67348 6.73992 6.17499 7.62206L5.64133 8.56636C5.57729 8.67971 5.45576 8.75 5.32386 8.75C3.9989 8.75 4.39197 6.82092 4.57205 6.05385C4.60379 5.91859 4.49931 5.78947 4.35811 5.78947Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
              }
              <span class="text-xs">${comment.dislikes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
  }).join('') + (hasMore ? `
    <div class="flex justify-center mt-6">
      <button 
        onclick="showMoreComments('${articleId}')" 
        class="cursor-pointer text-sm text-white hover:text-[#5355DD] transition-colors font-medium">
        Ver más comentarios
      </button>
    </div>
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

// Hacer funciones globales, accesibles desde otros scripts
window.updateCommentsForArticle = updateCommentsForArticle;
window.handleReaction = handleReaction;
window.showMoreComments = showMoreComments;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  // Asegurarse de que existe un ID de usuario
  getUserId();
  
  // Renderizar comentarios iniciales
  renderComments(getCurrentArticleId());
  
  // Manejar formulario
  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const authorInput = document.getElementById('authorName');
      const textarea = document.getElementById('comment');
      const author = authorInput ? authorInput.value.trim() : '';
      const text = textarea.value.trim();
      const error = document.getElementById("comment-error");

      // Validar campos
      let isValid = true;
      
      if (!author) {
        document.getElementById('nameError').classList.remove('hidden');
        isValid = false;
      } else {
        document.getElementById('nameError').classList.add('hidden');
      }
      
      if (!text) {
        error.classList.remove("hidden");
        isValid = false;
      } else {
        error.classList.add('hidden');
      }
      
      if (!isValid) return;
      
      const currentArticleId = getCurrentArticleId();
      const success = addComment(currentArticleId, author, text);
      
      if (success) {
        // Limpiar formulario
        if (authorInput) authorInput.value = '';
        textarea.value = '';
        currentLimit = 2; 
        renderComments(currentArticleId, currentLimit);
      }
    });
  }
});