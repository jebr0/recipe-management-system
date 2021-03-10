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

// DOM elements
//const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');



const setupUI = (user) => {
  if (user) {
    // account info
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>Logged in as ${user.email}</div>
        <div>Username: ${doc.data().bio}</div>
      `;
      accountDetails.innerHTML = html;
    });
    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // clear account info
    accountDetails.innerHTML = '';
    // toggle user elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    db.collection('guides').onSnapshot(snapshot => {
      //setupGuides(snapshot.docs);
      setupUI(user);
      setupUIR(user);
    }, err => console.log(err.message));
  } else {
    setupUI();
   // setupGuides([]);
  }
});



// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

console.log(email,password);
 // sign up the user & add firestore data
 auth.createUserWithEmailAndPassword(email, password).then(cred => {
  return db.collection('users').doc(cred.user.uid).set({
    bio: signupForm['signup-bio'].value
  });
}).then(() => {
  // close the signup modal & reset form
  const modal = document.querySelector('#modal-signup');
 modal.style.display="none";
  signupForm.reset();
});
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
  console.log("logout");
});


// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form

    const modal = document.querySelector('#modal-login');
     modal.style.display="none";
     console.log("userloged");
    loginForm.reset();
    
  });

});


//upload form
 const setupUIR=(user)=>{
const uploadrecipe = document.querySelector('#upload-recipe');
uploadrecipe.addEventListener('submit', (e) => {
  e.preventDefault();

   db.collection('recipe').add({
   Recipe:{title: uploadrecipe.title.value,
    ingredeints: uploadrecipe.ingredients.value,
    instructions: uploadrecipe.instructions.value,
    servings: uploadrecipe.servings.value,
    readyInMinutes: uploadrecipe.readyInMinutes.value,
    source: uploadrecipe.source.value,
    recipeimage: uploadrecipe.recipeimage.value
   }
  }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-user');
    console.log("recipe uploaded");
    uploadrecipe.reset();
  }).catch(err => {
    console.log(err.message);
  });
});
 
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