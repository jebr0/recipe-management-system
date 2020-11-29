import { elements} from './base';
export const clearRecipe = () => {
    elements.recipe.innerHTML ='';
}



const createnutritionbad = nutrients =>`

  <tr>
    <td>${nutrients.title} ${nutrients.amount}</td>
    <td>${nutrients.percentOfDailyNeeds}%</td>
   
  </tr>

 `;

 const createnutritiongood = nutrients =>`
 
 
 <tr>
 <td>${nutrients.title} ${nutrients.amount}</td>
 <td>${nutrients.percentOfDailyNeeds}%</td>

</tr>

 
 `;


const createIngredient = ingredient => `

<li class="recipe__item">


<div class="recipe__ingredient">
<img src=" https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}" alt="ingredent image" class="sty">
   <div class="recipe__count"> ${ingredient.amount.metric.value}
   <span class="recipe__unit"> ${ingredient.amount.metric.unit}</span><br>
    ${ingredient.name}
   </div>
    
</div>
</li>

 
`;






export const renderRecipe =( recipe, isLiked)=> {

    const markup =`
    
  
    <figure class="recipe__fig">
  
   <img src="${recipe.information.image}" alt="Tomato" class="recipe__img">
            <h1 class="recipe__title">
            <span>${recipe.information.title}</span>
              </h1>
</figure>
<div class="recipe__details">
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.information.readyInMinutes}</span>
        <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-decrease">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-minus"></use>
                </svg>
            </button>
            <button class="btn-tiny   btn-increase">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-plus"></use>
                </svg>
            </button>
        </div>

    </div>
    <button class="recipe__love">
        <svg class="header__likes">
        <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
        </svg>
    </button>
</div>



<div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">

    ${recipe.ingredients.map(el => createIngredient(el)).join('')}
    </ul>

   

    <button class="btn-small recipe__btn  recipe__btn--add">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
    </button>


    <button class="btn-small recipe__btn" onclick="document.getElementById('id03').style.display='block'" style="width:auto;  margin-top: 15px;">Get Recipe Instructions</button>


    <div id="id03" style="display:none;">
   
   
    ${recipe.information.instructions}
   
    <div style="background-color:#f1f1f1">
    <button type="button" onclick="document.getElementById('id03').style.display='none'" class="btn-small recipe__btn">Hide</button>
    
    </div>
    </div> 


    <button class="btn-small recipe__btn" onclick="document.getElementById('id02').style.display='block'" style="width:auto;  margin-top: 15px;">Get Recipe Nutrition</button>
    
    
   
    
    <div id="id02" style="display:none;">

        <div class="boxround" >
 
           <div  class="boxround">
           <span class="rounded"> Calories ${recipe.nutrition.calories}</span>
           <span class="rounded">Carbs ${recipe.nutrition.carbs}  </span>
           <span class="rounded"> Fat ${recipe.nutrition.fat}</span>
           <span class="rounded">Protien ${recipe.nutrition.protein}</span>
           
         </div>

         <span class="rounded">HealthScore ${recipe.information.healthScore}</span>

       

             <ul>

             <table style="width:100%">
             <span style="font-size:30px;text-shadow: 2px 2px 5px red;"> Limit These</span>

             <tr>
               <th>nutrients</th>
               <th>percentOfDailyNeeds%</th> 
              
             </tr>
             
             ${recipe.nutrition.bad.map(el => createnutritionbad(el)).join('')}
           
             
           </table>
             
            
             </ul>

           

             <ul>


             <table style="width:100%">
             <span style="font-size:30px;text-shadow: 2px 2px 5px green;"> Get Enough Of These</span>
             <tr>
               <th>nutrients</th>
               <th>percentOfDailyNeeds%</th> 
              
             </tr>
             
            
             ${recipe.nutrition.good.map(el => createnutritiongood(el)).join('')}
              
             
           </table>
             
              
            
             </ul>
        
      
         </div>

         <div style="background-color:#f1f1f1">
          <button type="button" onclick="document.getElementById('id02').style.display='none'" class="btn-small recipe__btn">Hide</button>
      
          </div>

        </div>
   </div>


</div>

<div class="recipe__directions">
    <h2 class="heading-2">Credits</h2>
    <p class="recipe__directions-text">
        Spoonacular API<br>
       ${recipe.information.creditsText}
    </p>
    <a class="btn-small recipe__btn" href="${recipe.information.sourceUrl}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>

    </a>
</div>

`;
elements.recipe.insertAdjacentHTML('afterbegin' , markup);

};

export const updateServingsIngredients = recipe => {
    // Update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    // Update ingredeints
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el, i) => {
        el.textContent = recipe.ingredients[i].amount.metric.value;
    });
};
