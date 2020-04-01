import { DOMelement, elementStrings } from './base'

export const renderItems = item => {
    const markup = `
                <li class="shopping__item" id="${item.id}" data-itemid="${item.id}">
                    <div class="shopping__count">
                        <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                        <p>${item.unit}</p>
                    </div>
                    <p class="shopping__description">${item.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </li>
    `;
   DOMelement.shopping.insertAdjacentHTML('beforeend', markup)
}

export const deleteItems = id => {
    const item = document.querySelector(`#${id}`);
    if(item) item.parentElement.removeChild(item)
};