import Search from './models/Search';
import Recipe from './models/Recipe'
import List from './models/List'
import * as recipeView from './views/recipeView'
import * as searchView from './views/searchView'
import * as listView from './views/listView'
import {DOMelement, renderLoader, clearLoader} from './views/base'
/** 
 * Global state of the app
 * Search Object 
 * current recipe object
 * liked recipes
*/


const state = {};
window.state = state;

const controlSearch = async () => {
    /**
     * get the query from the view
     * new search object and add to the state
     * prepare the ui for the results
     * search for recipes
     * render results on UI 
     */
    const query = searchView.getInput();
    // const query = 'pizza'
    if(query){
        state.search = new Search(query)
        searchView.clearResults();
        searchView.clearInput();
        renderLoader(DOMelement.searchRes)
        try {
            await state.search.getResult();
            searchView.renderResults(state.search.result)
        } catch {
            alert('Something Went Wrong :(');
        } finally {
            clearLoader();
        }
    }
}

DOMelement.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


DOMelement.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if(btn) {
        const gotoPage =parseInt(btn.dataset.goto);
        searchView.clearResults()
        searchView.renderResults(state.search.result, gotoPage);
    }
})

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '')
    if(id) {
        /**
         * prepare UI for changes 
         * Highlight selected search item
         * create new recipe object
         * get recipe data and parse ingridients 
         * calculate servings and time
         * render recipe
         */
        recipeView.clearRecipe();
        renderLoader(DOMelement.recipe)
        if(state.search) searchView.highlightSelected(id)
        state.recipe = new Recipe(id);
        // try{
            await state.recipe.getRecipe();
            state.recipe.parseIngridients()
            state.recipe.calTime();
            state.recipe.calServings();
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        // } catch(error) {
            //  alert('Something Went Wrong :(');
        // } 
    }
}

window.addEventListener('hashchange', controlRecipe)
window.addEventListener('load', controlRecipe)


DOMelement.recipe.addEventListener('click', e=> {
    if(e.target.matches('btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngridients(state.recipe)
        }
    } else if(e.target.matches('btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngridients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
})

const controlList = () => {
    /**
     * Create a new list if there is none yet
     * Add each in ingidient to the list and UI 
     */
    let item
     if(!state.list) state.list = new List();
     state.recipe.ingredients.forEach(el => {
         item = state.list.additems(el.count, el.unit, el.ingridient)
         listView.renderItems(item)
     }) 
     
}

/**
 * Handle delete and update list item event
 */

 DOMelement.shopping.addEventListener('click', e => {
     /**
      * Handle the delte item
      * delete from state
      * delete from UI
      * handle the count update
      */
     const id = e.target.closest('.shopping__item').dataset.itemid;
     if(e.target.matches('.shopping__delete, .shopping__delete *')){
         state.list.deleteItem(id)
         listView.deleteItems(id)
     } else if (e.target.matches('.shopping__count-value')){
         const val = parseFloat(e.target.value)
         state.list.updateCount(id, val)
     }
 })