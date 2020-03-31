import Search from './models/Search';
import Recipe from './models/Recipe'
import * as recipeView from './views/recipeView'
import * as searchView from './views/searchView'
import {DOMelement, renderLoader, clearLoader} from './views/base'
/** 
 * Global state of the app
 * Search Object 
 * current recipe object
 * liked recipes
*/


const state = {};

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
    console.log(id)
    if(id) {
        /**
         * prepare UI for changes 
         * create new recipe object
         * get recipe data and parse ingridients 
         * calculate servings and time
         * render recipe
         */
        recipeView.clearRecipe();
        renderLoader(DOMelement.recipe)
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