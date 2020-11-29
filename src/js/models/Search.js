import axios from 'axios';
import {apikey} from '../config';


export default class Search {
    constructor(query){
        this.query = query;
    }
async  getResults() {

    //const proxy ='https://cors-anywhere.herokuapp.com/';
   // const key ='74a5ef316fa6645362654b60e230b2c5';
   // const id ='a4e95384';
  try{
    //const res = await axios(`https://api.edamam.com/search?app_key=${apikey}&app_id=${apiid}&q=${this.query}`);
    //const res = await axios(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${this.query}&sort=calories&apiKey=784f7a05c9f24174a937dd4bad46af7b`);
    const res = await axios(`https://api.spoonacular.com/recipes/complexSearch?query=${this.query}&sort=calories&apiKey=784f7a05c9f24174a937dd4bad46af7b`);
    this.result = res.data.results;
   // this.cal = res.data.results.forEach(element => {return (element.nutrition) ;});
    
     //this.image = res1.data.results.image;
   // this.title = res1.data.results.title;
    console.log(res);
    console.log(this.result);

//this.cal.forEach(element => console.log(element));
    //console.log(this.cal);

  }catch(error){
      alert(error);
  }
}



 


}