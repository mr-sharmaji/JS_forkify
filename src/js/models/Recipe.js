import axios from 'axios';
import { proxy } from '../config'
export default class Recipe {
    constructor (id) {
        this.id = id
    }
    async getRecipe() {
        // try {
            const res = await axios(`${proxy}http://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            return this;
        // } catch (error){
            alert('Something Went Wrong :(')
        // }
    }

    calTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3)
        this.time = periods * 15
    }

    calServings() {
        this.servings = 4;
    }

    parseIngridients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons','teaspoon', 'cups', 'pounds']
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
        const units = [...unitsShort, 'kg', 'g']
        const newIngredients = this.ingredients.map(el => {
            /**
             * uniform units
             * remove parentheses
             * parse ingridients into count, unit and ingridient
             */

             let ingridient = el.toLowerCase();
             unitsLong.forEach((unit, i) => {
                ingridient= ingridient.replace(unit, unitsShort[i])
             });
             ingridient = ingridient.replace(/ *\([^)]*\) */g, " ");

             const arrIng = ingridient.split(' ');
             const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
             let objIng;
             if(unitIndex > -1){
                 /**
                  * There is a unit
                  * Ex. 4 1/2 cups, arrCount is [4, 1/2]
                  * Ex. 4 cups, arrCount is [4]
                  */

                  const arrCount = arrIng.slice(0, unitIndex)
                  let count;
                  if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'))
                  } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'))
                  }

                  objIng = {
                      count: +(Math.round(count + "e+2")  + "e-2"),
                      unit: arrIng[unitIndex],
                      ingridient: arrIng.slice(unitIndex+1).join(' ')
                  }


             } else if(parseInt(arrIng[0], 10)) {
                 /**
                  * there is NO unit, but 1st element is a number
                  */
                
                 objIng = {
                     count: parseInt(arrIng[0], 10),
                     unit: '',
                     ingridient: arrIng.slice(1).join(' ')
                 }
             } else if (unitIndex === -1){
                /**
                 * There is NO unit and NO number in the first position
                 */
                objIng = {
                    count: 1,
                    unit: '',
                    ingridient
                }
             }
             return objIng;
        });
        this.ingredients = newIngredients
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;
    
        this.ingredients.forEach (ing => {
            ing.count *= (newServings/this.servings)
        })

        this.servings = newServings
    }
}