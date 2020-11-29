import axios from 'axios';
import {apikey}  from '../config';


export default class Recipe {
    constructor(id) {
        this.id = id;

    }
    
    async getRecipe() {

        try {
            //const res = await axios(`https://api.edamam.com/search?app_key=${apikey}&app_id=${apiid}&r=${this.uri}`);

            //const res1 = await axios(`https://api.spoonacular.com/recipes/complexSearch?id=${this.id}&apiKey=784f7a05c9f24174a937dd4bad46af7b`);
            const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/ingredientWidget.json?apiKey=784f7a05c9f24174a937dd4bad46af7b`);

            const res1 = await axios(`https://api.spoonacular.com/recipes/${this.id}/nutritionWidget.json?apiKey=784f7a05c9f24174a937dd4bad46af7b`);
            const res2 = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?includeNutrition=false&apiKey=784f7a05c9f24174a937dd4bad46af7b`);
            console.log(res2);
            console.log(res1);
            //this.image = res1.data.results.image;
            //this.title = res1.data.results.title;
            this.information = res2.data;
            this.nutrition = res1.data;
             this.ingredients = res.data.ingredients;
             this.inglength =res.data.ingredients.length;
            // console.log(this.inglength);
            console.log(this.ingredients);
        } catch (error) {
            console.log(error)
        }
    }
   

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.inglength;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings() {
        this.servings = this.information.servings;
    }


    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.amount.metric.value *= (newServings / this.servings);
        });

        this.servings = newServings;
    }




}


