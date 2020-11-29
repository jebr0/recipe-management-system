import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader ,clearLoader, elementStrings} from './views/base';

/**
 * Global  state at the app
 * search object
 * Current recipe object
 * shopping list object
 * Like recipe
 * 
 */
const state ={
};

//control recipe search
const controlSearch = async () => {
   // 1 get query  from view
   const query = searchView.getInput();  //1000


   if(query){
     // 2 new seach object and add to state
     state.search = new Search(query);
      
     // 3 prepare UI for results
     searchView.clearInput();
     searchView.clearResults();
     renderLoader(elements.searchRes);
    

     // 4 Search for recipes
     await state.search.getResults();

     // 5 Render results on UI

     //console.log(state.search.result);
     clearLoader();
   
     
   
     searchView.renderResults(state.search.result);
    
     //recipeView.renderRecipe( state.likes.isLiked(id));

   }



}

elements.searchForm.addEventListener('submit', e =>{
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e =>{
 const btn = e.target.closest('.btn-inline');
 if(btn){
   const goToPage  = parseInt(btn.dataset.goto, 5);
   searchView.clearResults();
    searchView.renderResults(state.search.result,goToPage);
 console.log(goToPage);
 }
});

/**
 * http://www.edamam.com/ontologies/edamam.owl#recipe_b2ebad01df2a319d259c2d3f61eb40c5
 * www.edamam.com/ontologies/edamam.owl#recipe_1b6dfeaf0988f96b187c7c9bb69a14fa
 * Recipe controller
 */

 //const r = new Recipe('recipe_1b6dfeaf0988f96b187c7c9bb69a14fa');
// r.getRecipe();
const controlRecipe = async() => { 
  const id = window.location.hash.replace('#', '');
 
  //console.log(id);

   if( id){
      //prepare UI for changes
        recipeView.clearRecipe();
        listView.clearshopinglist();
     renderLoader(elements.recipe);
    
       //highlight selected search item
        if(state.search)   searchView.highlightSelected(id);

          // Create new reicpe object
           state.recipe = new Recipe(id);
             
           //state.recipe.itm= state.search.addnt(id);
          
             try {
             // get recipe data
               await state.recipe.getRecipe();

                 // calculate serving and time 
                    state.recipe.calcTime();
                   state.recipe.calcServings();
                      // render recipe 
                   console.log(state.recipe);
                     clearLoader();
                    
                    

                    recipeView.renderRecipe(
                      state.recipe,
                      state.likes.isLiked(id)
                      );
                    
                         } catch (err){
                           
                          alert('err processing recipe');
                          console.log(err);

                    }
   }
//const r = new Recipe(id);
//r.getRecipe();
//console.log(r);

};


//window.addEventListener('hashchange', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event , controlRecipe));

/** 
 * LIST CONTROLLER
 */
const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.amount.metric.value, el.amount.metric.unit, el.name);
      listView.renderItem(item);
  });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
      // Delete from state
      state.list.deleteItem(id);

      // Delete from UI
      listView.deleteItem(id);

  // Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
      
    const val = parseFloat(e.target.value, 10);
   
      state.list.updateCount(id, val);
     
  }
});

/** 
 * LIKE CONTROLLER
 */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
      // Add like to the state
      const newLike = state.likes.addLike(
          currentID,
          state.recipe.information.title,
         // state.recipe.author,
          state.recipe.information.image
      );
      // Toggle the like button
      likesView.toggleLikeBtn(true);

      // Add like to UI list
      likesView.renderLike(newLike);

  // User HAS liked current recipe
  } else {
      // Remove like from the state
      state.likes.deleteLike(currentID);

      // Toggle the like button
      likesView.toggleLikeBtn(false);

      // Remove like from UI list
      likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  
  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});





/// Handling recipe button clicks
elements.recipe.addEventListener('click' ,e  =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){

      // decrease button
      if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
      }
    } else  if(e.target.matches('.btn-increase, .btn-increase *')){
      // decrease button
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
      // Add ingredients to shopping list
      controlList();
  }  else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
} 
    

});