export const DOMelement = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe')
};

export const elementStrings = {
    loader: '.loader'
}

export const renderLoader = (parrent) => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parrent.insertAdjacentHTML('afterbegin', loader)
};

export const clearLoader = (parent) => {
    const loader = document.querySelector(`${elementStrings.loader}`)
    if(loader)
        loader.parentElement.removeChild(loader)
}