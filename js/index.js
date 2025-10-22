document.addEventListener('DOMContentLoaded', () => {
    //cargar datos
    async function loadData() {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    }
    
    //renderizar introduccion
    function renderIntroduction(intro, container) {
        if (!intro || !container) return;   
        const paragraphs = Object.values(intro) 
            .map(p => `<p>${marked.parse(p)}</p>`)    
            .join('');
        ;
        container.innerHTML = paragraphs;
    } 
    function renderFirstSection(data, container, title, paragraph, list, subtitle) {
        if (!data || !container) return;  
        console.log(data);
        title.innerHTML = marked.parse(data.title); 
        paragraph.innerHTML = marked.parse(data.paragraph);
        subtitle.innerHTML = marked.parse(data.subtitle);
        const listItems = data.list.map(item => `<li>${marked.parse(item)}</li>`).join('');
        list.innerHTML = listItems;
    }   
    
    //inicializacion
    async function init() {
        const data = await loadData();
        if (!data || data.length === 0) return;
        
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('id') || data[0].id;
        const article = data.find(a => a.id === articleId);
        if (!article) return;  

        const title = document.getElementById('title-blog');
        const introduction = document.getElementById('introduction');
        const firstSection = document.getElementById('first-section');
        const titleFirstSection = document.getElementById('title-first-section');
        const paragraphFirstSection = document.getElementById('paragraph-first-section');
        const listFirstSection = document.getElementById('list-first-section');
        const subtitleFirstSection = document.getElementById('subtitle-first-section');

        title.innerHTML = marked.parse(article.title);
        console.log(article.section_1);
        renderIntroduction(article.introduction, introduction);
        renderFirstSection(article.section_1, firstSection, titleFirstSection, paragraphFirstSection, listFirstSection, subtitleFirstSection);
    }

    init();
});