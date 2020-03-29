import { DOMelement, elementStrings } from './base'
export const getInput = () => DOMelement.searchInput.value

export const clearInput = () => {
    DOMelement.searchInput.value = ''
};

export const clearResults = () => {
    DOMelement.searchResultList.innerHTML = '';
    DOMelement.searchResPages.innerHTML = '';
}

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = []
    if(title.length > limit) {
        title.split(' ').reduce((acc, curr) => {
            if(acc+curr.length <= limit) {
                newTitle.push(curr)
            }
            return acc + curr.length
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    DOMelement.searchResultList.insertAdjacentHTML('beforeend', markup)
}
//type: prev pr next
const createPageButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page -1 : page +1}">
                <span>Page ${type === 'prev' ? page -1 : page +1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
`

const renderButton = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage)
    let button;
    if(page === 1 && pages > 1){
       button = createPageButton(page, 'next')
    } else if(page < pages){
        button = `
            ${createPageButton(page, 'prev')}
            ${createPageButton(page, 'next')}
        `;
    } else if(page === pages && pages > 1){
        button = createPageButton(page, 'prev')
    }

    DOMelement.searchResPages.insertAdjacentHTML('afterbegin', button)
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = Math.round((page - 1) * resPerPage);
    const end = Math.round(page * resPerPage);

    recipes.slice(start, end).forEach(renderRecipe);

    renderButton(page, recipes.length, resPerPage)
}