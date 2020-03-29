import Search from './models/Search';
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
    if(query){
        state.search = new Search(query)
        searchView.clearResults();
        searchView.clearInput();
        renderLoader(DOMelement.searchRes)
        await state.search.getResult();
        clearLoader();
        searchView.renderResults(state.search.result)
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