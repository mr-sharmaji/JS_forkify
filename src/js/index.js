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
    console.log(query)
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
})