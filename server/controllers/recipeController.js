require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {

  try{
    const limitNumber=4;
    const categories=await Category.find({}).limit(limitNumber);
    const latest=await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
    const Breakfast=await Recipe.find({'category':'Breakfast'}).limit(limitNumber);
    const Lunch=await Recipe.find({'category':'Lunch'}).limit(limitNumber);
    const Snacks=await Recipe.find({'category':'Snacks'}).limit(limitNumber);
    const Quick_Curries=await Recipe.find({'category':'Quick Curries'}).limit(limitNumber);

    const food={latest,Breakfast,Lunch,Snacks,Quick_Curries };



  
    

  res.render('index', { title: 'QuickDesi-Home',categories,food } );
  }catch(error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'QuickDesi - Categories', categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


// /**
//  * GET /categories/:id
//  * Categories By Id
// */
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'QuickDesi - Categories', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 
 
// /**
//  * GET /recipe/:id
//  * Recipe 
// */
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'QuickDesi - Recipe', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


// /**
//  * POST /search
//  * Search 
// */
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Quickdesi- Search', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}
// exports.searchRecipe = async (req, res) => {
//   try {
//     let searchTerm = req.body.searchTerm;
//     let recipe = await Recipe.find({ ingredients: { $elemMatch: { $regex: searchTerm, $options: 'i' } } });
//     res.render('search', { title: 'QuickDesi - Search', recipe });
//   } catch (error) {
//     res.status(500).send({ message: error.message || "Error Occurred" });
//   }
// }





  


/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'QuickDesi - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'QuickDesi- Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'QuickDesi - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      instructions:req.body.instructions,
      
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}



/**
 * Dummy Data Example 
*/
// async function insertDummyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Breakfast",
//         "image": "breakfast.jpg"
//       },
//       {
//         "name": "Lunch",
//         "image": "lunch.jpg"
//       }, 
//       {
//         "name": "Snacks",
//         "image": "snacks.jpg"
//       },
//       {
//         "name": "Quick Curries",
//         "image": "quick-curries.jpg"
//       }, 
//       
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDummyCategoryData();

// async function insertQuickCurriesRecipes() {
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Paneer Butter Masala",
//         "description": "Paneer butter masala is a rich and creamy curry made with paneer (Indian cottage cheese), tomatoes, and spices, finished with a touch of butter, perfect for vegetarians.",
//         "instructions": [
//           "Heat oil in a pan and add cumin seeds. Let them splutter.",
//           "Add chopped onions and sauté until golden brown.",
//           "Add ginger-garlic paste and cook until raw smell disappears.",
//           "Add tomato puree, turmeric powder, coriander powder, cumin powder, and red chili powder. Cook until the oil separates.",
//           "Stir in paneer cubes, cream, and butter. Simmer for a few minutes.",
//           "Garnish with chopped coriander leaves and serve hot with naan or rice."
//         ],
//         "ingredients": [
//           "200g paneer (Indian cottage cheese), cubed",
//           "1 onion, finely chopped",
//           "2 tomatoes, pureed",
//           "1 teaspoon ginger-garlic paste",
//           "1/2 teaspoon cumin seeds",
//           "1/2 teaspoon turmeric powder",
//           "1 teaspoon coriander powder",
//           "1/2 teaspoon cumin powder",
//           "1/2 teaspoon red chili powder",
//           "2 tablespoons cream",
//           "1 tablespoon butter",
//           "Salt to taste",
//           "2 tablespoons oil",
//           "Fresh coriander leaves for garnish"
//         ],
//         "category": "Quick Curries", 
//         "image": "paneer-butter-masala.jpg"
//       },
//       { 
//         "name": "Potato Curry",
//         "description": "Potato curry is a simple yet flavorful dish made with potatoes cooked in a spiced tomato-based gravy, perfect for a quick and satisfying meal.",
//         "instructions": [
//           "Heat oil in a pan and add cumin seeds. Let them splutter.",
//           "Add chopped onions and sauté until translucent.",
//           "Add chopped tomatoes and cook until softened.",
//           "Stir in turmeric powder, coriander powder, cumin powder, and red chili powder. Cook until the oil separates.",
//           "Add diced potatoes and water. Cover and cook until potatoes are tender.",
//           "Garnish with chopped cilantro before serving.",
//           "Serve hot with rice or roti."
//         ],
//         "ingredients": [
//           "3 potatoes, diced",
//           "1 onion, chopped",
//           "2 tomatoes, chopped",
//           "1 teaspoon ginger-garlic paste",
//           "1/2 teaspoon cumin seeds",
//           "1/2 teaspoon turmeric powder",
//           "1 teaspoon coriander powder",
//           "1/2 teaspoon cumin powder",
//           "1/2 teaspoon red chili powder",
//           "Salt to taste",
//           "2 tablespoons oil",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Quick Curries", 
//         "image": "potato-curry.jpg"
//       },
//       { 
//         "name": "Mushroom Matar",
//         "description": "Mushroom matar is a delicious curry made with mushrooms and peas cooked in a spiced onion-tomato gravy, perfect for a quick vegetarian meal.",
//         "instructions": [
//           "Heat oil in a pan and add cumin seeds. Let them splutter.",
//           "Add chopped onions and sauté until golden brown.",
//           "Add ginger-garlic paste and cook until raw smell disappears.",
//           "Add tomato puree, turmeric powder, coriander powder, cumin powder, and red chili powder. Cook until the oil separates.",
//           "Stir in sliced mushrooms and peas. Cook until mushrooms are tender.",
//           "Garnish with chopped cilantro before serving.",
//           "Serve hot with rice or roti."
//         ],
//         "ingredients": [
//           "200g mushrooms, sliced",
//           "1 cup green peas",
//           "1 onion, finely chopped",
//           "2 tomatoes, pureed",
//           "1 teaspoon ginger-garlic paste",
//           "1/2 teaspoon cumin seeds",
//           "1/2 teaspoon turmeric powder",
//           "1 teaspoon coriander powder",
//           "1/2 teaspoon cumin powder",
//           "1/2 teaspoon red chili powder",
//           "Salt to taste",
//           "2 tablespoons oil",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Quick Curries", 
//         "image": "mushroom-matar.jpg"
//       },
//       { 
//         "name": "Paneer Vindaloo",
//         "description": "Paneer vindaloo is a spicy and tangy curry made with paneer (Indian cottage cheese) and potatoes cooked in a fiery vindaloo sauce, perfect for those who love bold flavors.",
//         "instructions": [
//           "Heat oil in a pan and add mustard seeds. Let them splutter.",
//           "Add chopped onions and sauté until golden brown.",
//           "Add ginger-garlic paste and cook until raw smell disappears.",
//           "Add tomato puree, vinegar, sugar, and salt. Cook until the oil separates.",
//           "Stir in diced potatoes and cook until slightly tender.",
//           "Add paneer cubes and vindaloo paste. Cook until potatoes are fully cooked and the sauce thickens.",
//           "Garnish with chopped cilantro before serving.",
//           "Serve hot with rice or naan."
//         ],
//         "ingredients": [
//           "200g paneer (Indian cottage cheese), cubed",
//           "2 potatoes, diced",
//           "1 onion, finely chopped",
//           "2 tomatoes, pureed",
//           "1 teaspoon ginger-garlic paste",
//           "1 teaspoon mustard seeds",
//           "2 tablespoons vinegar",
//           "1 teaspoon sugar",
//           "Salt to taste",
//           "2 tablespoons oil",
//           "2 tablespoons vindaloo paste",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Quick Curries", 
//         "image": "paneer-vindaloo.jpg"
//       },
//       { 
//         "name": "Saag Aloo",
//         "description": "Saag aloo is a traditional Indian dish made with spinach (saag) and potatoes (aloo) cooked with aromatic spices, perfect for a nutritious and flavorful meal.",
//         "instructions": [
//           "Heat oil in a pan and add cumin seeds. Let them splutter.",
//           "Add chopped onions and sauté until golden brown.",
//           "Add ginger-garlic paste and cook until raw smell disappears.",
//           "Add tomato puree and cook until softened.",
//           "Stir in chopped spinach and diced potatoes. Cook until potatoes are tender.",
//           "Add garam masala, turmeric powder, and red chili powder. Mix well.",
//           "Garnish with chopped cilantro before serving.",
//           "Serve hot with rice or roti."
//         ],
//         "ingredients": [
//           "2 potatoes, diced",
//           "200g spinach, chopped",
//           "1 onion, finely chopped",
//           "2 tomatoes, pureed",
//           "1 teaspoon ginger-garlic paste",
//           "1/2 teaspoon cumin seeds",
//           "1/2 teaspoon garam masala",
//           "1/2 teaspoon turmeric powder",
//           "1/2 teaspoon red chili powder",
//           "Salt to taste",
//           "2 tablespoons oil",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Quick Curries", 
//         "image": "saag-aloo.jpg"
//       },
//       { 
//         "name": "Vegetable Korma",
//         "description": "Vegetable korma is a rich and creamy curry made with mixed vegetables cooked in a spiced gravy made with cashew nuts, coconut milk, and aromatic spices, perfect for a special occasion or a comforting meal.",
//         "instructions": [
//           "Heat oil in a pan and add whole spices (cinnamon, cardamom, cloves, and bay leaves). Let them splutter.",
//           "Add chopped onions and sauté until golden brown.",
//           "Add ginger-garlic paste and cook until raw smell disappears.",
//           "Add tomato puree and cook until softened.",
//           "Grind cashew nuts into a fine paste and add it to the pan. Mix well.",
//           "Stir in mixed vegetables and coconut milk. Cook until vegetables are tender.",
//           "Add garam masala and salt to taste. Mix well.",
//           "Garnish with chopped cilantro before serving.",
//           "Serve hot with rice or naan."
//         ],
//         "ingredients": [
//           "Assorted vegetables, diced (carrots, peas, potatoes, beans, etc.)",
//           "1 onion, finely chopped",
//           "2 tomatoes, pureed",
//           "1 teaspoon ginger-garlic paste",
//           "1/2 cup cashew nuts",
//           "1 can (400ml) coconut milk",
//           "Whole spices (cinnamon, cardamom, cloves, bay leaves)",
//           "1/2 teaspoon garam masala",
//           "Salt to taste",
//           "2 tablespoons oil",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Quick Curries", 
//         "image": "vegetable-korma.jpg"
//       },
//       { 
//         "name": "Egg Curry",
//         "description": "Egg curry is a flavorful dish made with hard-boiled eggs cooked in a spiced tomato-based gravy, perfect for a quick and satisfying meal.",
//         "instructions": [
//           "Heat oil in a pan and add cumin seeds. Let them splutter.",
//           "Add chopped onions and sauté until golden brown.",
//           "Add ginger-garlic paste and cook until raw smell disappears.",
//           "Add tomato puree, turmeric powder, coriander powder, cumin powder, and red chili powder. Cook until the oil separates.",
//           "Add boiled eggs and water. Cover and simmer for a few minutes.",
//           "Garnish with chopped cilantro before serving.",
//           "Serve hot with rice or roti."
//         ],
//         "ingredients": [
//           "4 eggs, hard-boiled",
//           "1 onion, finely chopped",
//           "2 tomatoes, pureed",
//           "1 teaspoon ginger-garlic paste",
//           "1/2 teaspoon cumin seeds",
//           "1/2 teaspoon turmeric powder",
//           "1 teaspoon coriander powder",
//           "1/2 teaspoon cumin powder",
//           "1/2 teaspoon red chili powder",
//           "Salt to taste",
//           "2 tablespoons oil",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Quick Curries", 
//         "image": "egg-curry.jpg"
//       },
//       { 
//         "name": "Coconut Shrimp Curry",
//         "description": "Coconut shrimp curry is a creamy and aromatic dish made with shrimp cooked in a flavorful coconut milk-based sauce, perfect for seafood lovers.",
//         "instructions": [
//           "Heat oil in a pan and add chopped onions. Sauté until golden brown.",
//           "Add minced garlic, grated ginger, and green chilies. Cook until fragrant.",
//           "Add tomato puree and cook until softened.",
//           "Stir in coconut milk and water. Bring to a simmer.",
//           "Add cleaned shrimp and cook until they turn pink and opaque.",
//           "Season with turmeric powder, coriander powder, cumin powder, and red chili powder. Mix well.",
//           "Garnish with chopped cilantro before serving.",
//           "Serve hot with rice or naan."
//         ],
//         "ingredients": [
//           "300g shrimp, peeled and deveined",
//           "1 onion, finely chopped",
//           "3 cloves garlic, minced",
//           "1-inch ginger, grated",
//           "2 green chilies, slit",
//           "2 tomatoes, pureed",
//           "1 can (400ml) coconut milk",
//           "1/2 teaspoon turmeric powder",
//           "1 teaspoon coriander powder",
//           "1/2 teaspoon cumin powder",
//           "1/2 teaspoon red chili powder",
//           "Salt to taste",
//           "2 tablespoons oil",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Quick Curries", 
//         "image": "coconut-shrimp-curry.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('Error:', error);
//   }
// }

// insertQuickCurriesRecipes();



// Define an asynchronous function to insert breakfast recipes into the database
// async function insertBreakfastRecipes() {
//   try {
//     // Insert multiple recipes into the database
//     await Recipe.insertMany([
//       // Recipe for Upma
//       { 
//         "name": "Upma",
//         "description": "Upma is a savory South Indian breakfast dish made from dry roasted semolina (sooji) cooked with vegetables and seasoned with spices.",
//         "instructions": [
//           "Dry roast semolina in a pan until golden brown and aromatic. Set aside.",
//           "Heat oil in a pan and add mustard seeds, cumin seeds, and curry leaves.",
//           "Add chopped onions, green chilies, and vegetables of your choice. Sauté until tender.",
//           "Add water, salt, and the roasted semolina. Mix well.",
//           "Cover and cook until the upma is soft and fluffy.",
//           "Garnish with chopped coriander leaves and serve hot."
//         ],
//         "ingredients": [
//           "Semolina (sooji)",
//           "Onion, finely chopped",
//           "Green chilies, chopped",
//           "Mixed vegetables (carrot, peas, beans), chopped",
//           "Mustard seeds",
//           "Cumin seeds",
//           "Curry leaves",
//           "Salt to taste",
//           "Oil",
//           "Fresh coriander leaves for garnish"
//         ],
//         "category": "Breakfast", 
//         "image": "upma.jpg"
//       },
//       // Recipe for Idli Vada
//       { 
//         "name": "Idli Vada",
//         "description": "Idli Vada is a classic South Indian breakfast combination consisting of steamed rice cakes (idli) served with savory lentil donuts (vada) and accompanied by coconut chutney and sambar.",
//         "instructions": [
//           "Prepare the idli batter by soaking rice and lentils, then grinding them into a smooth paste and fermenting overnight.",
//           "For vada, soak urad dal and grind into a thick batter. Add chopped onions, green chilies, curry leaves, and spices. Mix well.",
//           "Shape the idlis and vadas and steam them until cooked.",
//           "Serve hot with coconut chutney and sambar."
//         ],
//         "ingredients": [
//           "Idli batter (made from rice and lentils)",
//           "Urad dal (black gram dal) for vada",
//           "Onion, finely chopped",
//           "Green chilies, finely chopped",
//           "Curry leaves",
//           "Salt to taste",
//           "Oil for deep frying",
//           "Coconut chutney",
//           "Sambar"
//         ],
//         "category": "Breakfast", 
//         "image": "idli-vada.jpg"
//       },
//       // Recipe for Poori
//       { 
//         "name": "Poori",
//         "description": "Poori is a popular Indian fried bread made from unleavened wheat flour dough. It's crispy on the outside and soft on the inside, often served with spicy potato curry.",
//         "instructions": [
//           "Prepare a smooth dough by mixing wheat flour, a pinch of salt, and water. Let it rest for 30 minutes.",
//           "Divide the dough into small balls and roll each ball into a thin circle.",
//           "Heat oil in a deep frying pan. Fry the rolled dough circles until they puff up and turn golden brown.",
//           "Serve hot with potato curry or any desired side dish."
//         ],
//         "ingredients": [
//           "Wheat flour",
//           "Salt",
//           "Water",
//           "Oil for frying",
//           "Potato curry or side dish of your choice"
//         ],
//         "category": "Breakfast", 
//         "image": "poori.jpg"
//       },
//       // Recipe for Thepla
//       { 
//         "name": "Thepla",
//         "description": "Thepla is a traditional Gujarati flatbread made from wheat flour, spices, and fenugreek leaves (methi). It's a popular breakfast or snack option, often served with yogurt or pickles.",
//         "instructions": [
//           "In a bowl, mix wheat flour, chopped fenugreek leaves, spices, and water to form a soft dough.",
//           "Divide the dough into small balls and roll each ball into a thin circle.",
//           "Heat a griddle or tawa and cook the theplas on both sides until golden brown spots appear.",
//           "Brush with ghee or oil and serve hot with yogurt or pickles."
//         ],
//         "ingredients": [
//           "Wheat flour",
//           "Fenugreek leaves (methi), chopped",
//           "Turmeric powder",
//           "Red chili powder",
//           "Coriander powder",
//           "Cumin powder",
//           "Salt",
//           "Oil or ghee",
//           "Yogurt or pickles for serving"
//         ],
//         "category": "Breakfast", 
//         "image": "thepla.jpg"
//       },
//       // Recipe for Akki Roti
//       { 
//         "name": "Akki Roti",
//         "description": "Akki Roti is a traditional South Indian flatbread made from rice flour, mixed with finely chopped vegetables and spices. It's typically served with chutney or pickle.",
//         "instructions": [
//           "In a bowl, mix rice flour, finely chopped vegetables, grated coconut, green chilies, coriander leaves, cumin seeds, and salt.",
//           "Add water gradually to form a soft dough.",
//           "Divide the dough into portions and flatten each portion into thin rotis using your hands.",
//           "Heat a griddle or tawa and cook the akki rotis on both sides until golden brown spots appear.",
//           "Serve hot with chutney or pickle."
//         ],
//         "ingredients": [
//           "Rice flour",
//           "Mixed vegetables (carrot, cabbage, onion), finely chopped",
//           "Grated coconut",
//           "Green chilies, finely chopped",
//           "Coriander leaves, chopped",
//           "Cumin seeds",
//           "Salt",
//           "Oil for cooking",
//           "Chutney or pickle for serving"
//         ],
//         "category": "Breakfast", 
//         "image": "masala-akki-roti.jpg"
//       },
//       // Recipe for Aloo Paratha
//       { 
//         "name": "Aloo Paratha",
//         "description": "Aloo Paratha is a popular North Indian breakfast dish made from whole wheat dough stuffed with a spicy mashed potato filling. It's typically served with yogurt, pickle, or chutney.",
//         "instructions": [
//           "Prepare a soft dough by kneading whole wheat flour, salt, and water.",
//           "For the filling, mix boiled and mashed potatoes with chopped green chilies, coriander leaves, spices, and salt.",
//           "Divide the dough and filling into portions.",
//           "Roll out a portion of the dough, place a portion of the filling in the center, and seal the edges.",
//           "Roll out the stuffed dough into a thick paratha.",
//           "Heat a griddle or tawa and cook the paratha on both sides until golden brown spots appear, brushing with oil or ghee.",
//           "Serve hot with yogurt, pickle, or chutney."
//         ],
//         "ingredients": [
//           "Whole wheat flour",
//           "Potatoes, boiled and mashed",
//           "Green chilies, finely chopped",
//           "Coriander leaves, chopped",
//           "Turmeric powder",
//           "Red chili powder",
//           "Coriander powder",
//           "Cumin powder",
//           "Salt",
//           "Oil or ghee for cooking",
//           "Yogurt, pickle, or chutney for serving"
//         ],
//         "category": "Breakfast", 
//         "image": "aloo-paratha.jpg"
//       },
//       // Recipe for Mangalore Buns
//       { 
//         "name": "Mangalore Buns",
//         "description": "Mangalore Buns is a sweet and fluffy fried bread from the coastal region of Mangalore, Karnataka. It's made from ripe bananas, flour, yogurt, and spices, served as a breakfast or snack.",
//         "instructions": [
//           "In a bowl, mash ripe bananas and add flour, yogurt, sugar, salt, cardamom powder, and baking soda.",
//           "Mix well to form a soft and sticky dough. Let it rest for 2 hours.",
//           "Divide the dough into small portions and shape them into thick discs.",
//           "Heat oil in a deep frying pan. Fry the discs until golden brown and crispy on the outside.",
//           "Serve hot as is or with chutney or pickle."
//         ],
//         "ingredients": [
//           "Ripe bananas, mashed",
//           "All-purpose flour",
//           "Yogurt",
//           "Sugar",
//           "Salt",
//           "Cardamom powder",
//           "Baking soda",
//           "Oil for frying",
//           "Chutney or pickle for serving"
//         ],
//         "category": "Breakfast", 
//         "image": "mangalore-buns.jpg"
//       },
//       // Recipe for Egg Bhurji
//       { 
//         "name": "Egg Bhurji",
//         "description": "Egg Bhurji, also known as Anda Bhurji, is a popular Indian scrambled egg dish made with eggs, onions, tomatoes, and spices. It's often enjoyed as a hearty breakfast or brunch option.",
//         "instructions": [
//           "Heat oil in a pan and add chopped onions. Sauté until translucent.",
//           "Add chopped tomatoes and cook until soft.",
//           "Beat eggs in a bowl and pour into the pan. Stir continuously until the eggs are scrambled and cooked.",
//           "Add spices like turmeric powder, red chili powder, garam masala, and salt. Mix well.",
//           "Garnish with chopped coriander leaves and serve hot with bread or roti."
//         ],
//         "ingredients": [
//           "Eggs",
//           "Onion, finely chopped",
//           "Tomato, finely chopped",
//           "Green chilies, finely chopped",
//           "Turmeric powder",
//           "Red chili powder",
//           "Garam masala",
//           "Salt to taste",
//           "Oil",
//           "Coriander leaves for garnish",
//           "Bread or roti for serving"
//         ],
//         "category": "Breakfast", 
//         "image": "egg-bhurji.jpg"
//       },
//       // Add more recipes here...
//     ]);
//   } catch (error) {
//     console.log('Error:', error);
//   }
// }


// insertBreakfastRecipes();




// async function insertLunchRecipes() {
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Chicken Biryani",
//         "description": "Chicken biryani is a delicious and aromatic rice dish made with marinated chicken and fragrant spices, perfect for a hearty meal.",
//         "instructions": [
//           "Marinate chicken pieces in yogurt, ginger-garlic paste, and biryani masala for a few hours.",
//           "Soak basmati rice in water for 30 minutes, then drain and set aside.",
//           "Heat oil in a large pot and add whole spices (such as cinnamon, cardamom, cloves, and bay leaves).",
//           "Add sliced onions and sauté until golden brown.",
//           "Add the marinated chicken and cook until partially done.",
//           "Layer the partially cooked rice over the chicken, then pour in saffron-infused milk and sprinkle fried onions and mint leaves on top.",
//           "Cover and cook on low heat until the rice is fully cooked and aromatic.",
//           "Serve hot with raita (yogurt dip) and salad."
//         ],
//         "ingredients": [
//           "Chicken pieces",
//           "Basmati rice",
//           "Onion, sliced",
//           "Yogurt",
//           "Ginger-garlic paste",
//           "Biryani masala",
//           "Saffron strands soaked in milk",
//           "Fried onions",
//           "Mint leaves",
//           "Whole spices (cinnamon, cardamom, cloves, bay leaves)",
//           "Salt to taste",
//           "Oil"
//         ],
//         "category": "Lunch", 
//         "image": "chicken-biryani.jpg"
//       },
//       { 
//         "name": "Veg Fried Rice",
//         "description": "Veg fried rice is a quick and flavorful dish made with cooked rice, mixed vegetables, and savory sauces, perfect for a light lunch.",
//         "instructions": [
//           "Heat oil in a large pan or wok.",
//           "Add chopped vegetables (such as carrots, peas, bell peppers, and cabbage) and stir-fry until partially cooked.",
//           "Add cooked rice and soy sauce. Stir-fry until well combined.",
//           "Push the rice mixture to the side of the pan and pour beaten eggs into the empty space. Scramble the eggs until cooked.",
//           "Mix the scrambled eggs with the rice mixture.",
//           "Season with salt and pepper to taste. Garnish with chopped green onions.",
//           "Serve hot as is or with your favorite sauce."
//         ],
//         "ingredients": [
//           "Cooked rice",
//           "Mixed vegetables (carrots, peas, bell peppers, cabbage, etc.)",
//           "Eggs",
//           "Soy sauce",
//           "Salt to taste",
//           "Pepper to taste",
//           "Oil",
//           "Chopped green onions for garnish"
//         ],
//         "category": "Lunch", 
//         "image": "veg-fried-rice.jpg"
//       },
//       { 
//         "name": "Butter Chicken",
//         "description": "Butter chicken is a rich and creamy chicken dish cooked in a tomato-based sauce with butter and cream, making it a delightful treat for lunch.",
//         "instructions": [
//           "Marinate chicken pieces in yogurt, ginger-garlic paste, and spices for a few hours.",
//           "Grill or roast the marinated chicken until partially cooked.",
//           "In a separate pan, heat butter and add chopped onions. Sauté until golden brown.",
//           "Add tomato puree, cream, and fenugreek leaves. Cook until the sauce thickens.",
//           "Add the partially cooked chicken pieces to the sauce and simmer until fully cooked and flavors are blended.",
//           "Garnish with cream and cilantro before serving.",
//           "Serve hot with naan or rice."
//         ],
//         "ingredients": [
//           "Chicken pieces",
//           "Yogurt",
//           "Ginger-garlic paste",
//           "Spices (such as cumin, coriander, turmeric, garam masala)",
//           "Butter",
//           "Onion, chopped",
//           "Tomato puree",
//           "Cream",
//           "Dried fenugreek leaves (kasuri methi)",
//           "Salt to taste",
//           "Oil",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Lunch", 
//         "image": "butter-chicken.jpg"
//       },
//       { 
//         "name": "Paneer Pulao",
//         "description": "Paneer pulao is a fragrant and flavorful rice dish made with basmati rice, paneer (Indian cottage cheese), and aromatic spices, perfect for a satisfying lunch.",
//         "instructions": [
//           "Soak basmati rice in water for 30 minutes, then drain and set aside.",
//           "In a large pot, heat ghee or oil and add whole spices (such as cloves, cardamom, cinnamon, and bay leaves).",
//           "Add sliced onions and sauté until golden brown.",
//           "Add ginger-garlic paste and green chilies. Sauté until fragrant.",
//           "Add cubed paneer and sauté until lightly browned.",
//           "Add the soaked rice and water. Season with salt.",
//           "Cover and cook until the rice is fully cooked and fluffy.",
//           "Garnish with fried onions and chopped cilantro before serving.",
//           "Serve hot with raita (yogurt dip) or curry."
//         ],
//         "ingredients": [
//           "Basmati rice",
//           "Paneer (Indian cottage cheese), cubed",
//           "Ghee or oil",
//           "Whole spices (cloves, cardamom, cinnamon, bay leaves)",
//           "Onion, sliced",
//           "Ginger-garlic paste",
//           "Green chilies, chopped",
//           "Salt to taste",
//           "Water",
//           "Fried onions for garnish",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Lunch", 
//         "image": "paneer-pulao.jpg"
//       },
//       { 
//         "name": "Dal Makhani",
//         "description": "Dal makhani is a creamy and indulgent lentil dish made with black lentils, kidney beans, butter, and cream, perfect for a comforting lunch.",
//         "instructions": [
//           "Soak black lentils and kidney beans overnight, then pressure cook until soft and mushy.",
//           "In a large pan, heat butter and add cumin seeds, chopped onions, and minced garlic. Sauté until golden brown.",
//           "Add tomato puree, cooked lentils, kidney beans, and water. Simmer for about an hour.",
//           "Add cream and cook for another 15-20 minutes until the flavors are well combined and the dal has thickened.",
//           "Garnish with a dollop of butter and chopped cilantro before serving.",
//           "Serve hot with rice or naan."
//         ],
//         "ingredients": [
//           "Black lentils (urad dal)",
//           "Kidney beans (rajma)",
//           "Butter",
//           "Cumin seeds",
//           "Onion, chopped",
//           "Garlic, minced",
//           "Tomato puree",
//           "Cream",
//           "Salt to taste",
//           "Water",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Lunch", 
//         "image": "dal-makhani.jpg"
//       },
//       { 
//         "name": "Egg Biryani",
//         "description": "Egg biryani is a flavorful rice dish made with boiled eggs and aromatic spices, perfect for a satisfying lunch.",
//         "instructions": [
//           "Boil eggs until hard-boiled, then peel and set aside.",
//           "Soak basmati rice in water for 30 minutes, then drain and set aside.",
//           "Heat oil in a large pot and add whole spices (such as cinnamon, cardamom, cloves, and bay leaves).",
//           "Add sliced onions and sauté until golden brown.",
//           "Add ginger-garlic paste and cook until fragrant.",
//           "Add chopped tomatoes and cook until softened.",
//           "Add boiled eggs, rice, and water. Season with salt.",
//           "Cover and cook until the rice is fully cooked and fluffy.",
//           "Garnish with fried onions and chopped cilantro before serving.",
//           "Serve hot with raita (yogurt dip) or salad."
//         ],
//         "ingredients": [
//           "Eggs",
//           "Basmati rice",
//           "Oil",
//           "Whole spices (cinnamon, cardamom, cloves, bay leaves)",
//           "Onion, sliced",
//           "Ginger-garlic paste",
//           "Tomato, chopped",
//           "Salt to taste",
//           "Water",
//           "Fried onions for garnish",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Lunch", 
//         "image": "egg-biryani.jpg"
//       },
//       { 
//         "name": "Pongal",
//         "description": "Pongal is a traditional South Indian dish made with rice and lentils, cooked and seasoned with spices, perfect for a wholesome lunch.",
//         "instructions": [
//           "Dry roast rice and split moong dal until lightly golden and aromatic.",
//           "Pressure cook the roasted rice and dal with water until soft and mushy.",
//           "In a separate pan, heat ghee and add mustard seeds, cumin seeds, curry leaves, and chopped ginger. Sauté until fragrant.",
//           "Add the cooked rice and dal mixture to the pan. Season with salt and mix well.",
//           "Garnish with chopped cilantro before serving.",
//           "Serve hot with coconut chutney or sambar."
//         ],
//         "ingredients": [
//           "Rice",
//           "Split moong dal",
//           "Ghee",
//           "Mustard seeds",
//           "Cumin seeds",
//           "Curry leaves",
//           "Ginger, chopped",
//           "Salt to taste",
//           "Water",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Lunch", 
//         "image": "pongal.jpg"
//       },
//       { 
//         "name": "Rajma Chawal",
//         "description": "Rajma chawal is a classic North Indian comfort food consisting of red kidney beans cooked in a thick tomato-based gravy, served with steamed rice.",
//         "instructions": [
//           "Soak rajma (red kidney beans) overnight, then pressure cook until soft and tender.",
//           "In a large pan, heat oil and add cumin seeds, chopped onions, and minced garlic. Sauté until golden brown.",
//           "Add chopped tomatoes and cook until they turn mushy.",
//           "Add cooked rajma along with water, turmeric powder, red chili powder, and salt. Simmer for about 15-20 minutes.",
//           "Garnish with chopped cilantro before serving.",
//           "Serve hot with steamed rice."
//         ],
//         "ingredients": [
//           "Rajma (red kidney beans)",
//           "Oil",
//           "Cumin seeds",
//           "Onion, chopped",
//           "Garlic, minced",
//           "Tomatoes, chopped",
//           "Turmeric powder",
//           "Red chili powder",
//           "Salt to taste",
//           "Water",
//           "Fresh cilantro for garnish"
//         ],
//         "category": "Lunch", 
//         "image": "rajma-chawal.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('Error:', error);
//   }
// }

// insertLunchRecipes();



// async function insertSnacksRecipes() {
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Bhel Puri",
//         "description": "Bhel Puri is a popular Indian street food snack made with puffed rice, vegetables, tangy chutneys, and crunchy sev.",
//         "instructions": [
//           "In a large mixing bowl, combine puffed rice, chopped onions, tomatoes, boiled potatoes, and chopped coriander leaves.",
//           "Add green chutney, tamarind chutney, chaat masala, and salt. Mix well.",
//           "Garnish with sev and serve immediately."
//         ],
//         "ingredients": [
//           "Puffed rice",
//           "Onion, finely chopped",
//           "Tomato, finely chopped",
//           "Potatoes, boiled and chopped",
//           "Coriander leaves, chopped",
//           "Green chutney",
//           "Tamarind chutney",
//           "Chaat masala",
//           "Salt to taste",
//           "Sev (fried gram flour noodles)"
//         ],
//         "category": "Snacks", 
//         "image": "bhel-puri.jpg"
//       },
//       { 
//         "name": "Vada Pav",
//         "description": "Vada Pav is a popular Mumbai street food snack consisting of a deep-fried potato dumpling served in a bread bun with chutneys.",
//         "instructions": [
//           "Prepare the potato filling by mashing boiled potatoes and mixing them with spices and chopped coriander leaves.",
//           "Form the potato mixture into balls and dip them in a chickpea flour batter.",
//           "Deep fry the coated potato balls until golden brown and crispy.",
//           "Assemble the vada pav by placing a vada in a pav (bread bun) along with garlic chutney and green chutney.",
//           "Serve hot with fried green chilies and fried green chilies."
//         ],
//         "ingredients": [
//           "Potatoes, boiled and mashed",
//           "Garlic, minced",
//           "Green chilies, chopped",
//           "Coriander leaves, chopped",
//           "Chickpea flour (besan)",
//           "Bread buns (pav)",
//           "Oil for frying",
//           "Salt to taste"
//         ],
//         "category": "Snacks", 
//         "image": "vada-pav.jpg"
//       },
//       { 
//         "name": "Dabeli",
//         "description": "Dabeli is a spicy and flavorful Indian street food snack originating from the Kutch region of Gujarat, consisting of a spiced potato mixture served inside a pav (bread bun) along with chutneys and toppings.",
//         "instructions": [
//           "Prepare the dabeli masala by dry roasting spices and grinding them into a powder.",
//           "Prepare the potato filling by sautéing boiled and mashed potatoes with dabeli masala, tamarind chutney, and garlic chutney.",
//           "Assemble the dabeli by stuffing the potato filling inside a pav along with chutneys, chopped onions, pomegranate seeds, and sev.",
//           "Toast the assembled dabeli on a hot griddle with butter until crispy and golden brown.",
//           "Serve hot with more chutneys and sev on top."
//         ],
//         "ingredients": [
//           "Potatoes, boiled and mashed",
//           "Pav (bread buns)",
//           "Onion, finely chopped",
//           "Pomegranate seeds",
//           "Sev (fried gram flour noodles)",
//           "Butter",
//           "Tamarind chutney",
//           "Garlic chutney",
//           "Dabeli masala",
//           "Salt to taste"
//         ],
//         "category": "Snacks", 
//         "image": "dabeli.jpg"
//       },
//       { 
//         "name": "Pani Puri",
//         "description": "Pani Puri, also known as golgappa or phuchka, is a popular Indian street food snack consisting of crispy hollow puris filled with spicy tangy water, tamarind chutney, potato mixture, and chickpeas.",
//         "instructions": [
//           "Prepare the pani by mixing water with mint-coriander paste, tamarind chutney, chaat masala, black salt, and roasted cumin powder.",
//           "Prepare the potato filling by mixing boiled and mashed potatoes with chopped onions, green chilies, chaat masala, and coriander leaves.",
//           "Assemble the pani puris by filling each puri with potato mixture and chickpeas, then dipping them in the prepared pani.",
//           "Serve immediately."
//         ],
//         "ingredients": [
//           "Pani puris (hollow crispy puris)",
//           "Potatoes, boiled and mashed",
//           "Onion, finely chopped",
//           "Green chilies, chopped",
//           "Coriander leaves, chopped",
//           "Chaat masala",
//           "Black salt",
//           "Roasted cumin powder",
//           "Mint-coriander paste",
//           "Tamarind chutney",
//           "Chickpeas",
//           "Water"
//         ],
//         "category": "Snacks", 
//         "image": "pani-puri.jpg"
//       },
//       { 
//         "name": "Gobi Manchurian",
//         "description": "Gobi Manchurian is an Indo-Chinese fried cauliflower dish tossed in a tangy and spicy sauce, perfect as a starter or snack.",
//         "instructions": [
//           "Prepare the cauliflower florets by blanching them in hot water and coating them in a batter made of corn flour, all-purpose flour, ginger-garlic paste, and spices.",
//           "Deep fry the coated cauliflower florets until golden brown and crispy.",
//           "Prepare the sauce by sautéing ginger, garlic, green chilies, and spring onions, then adding soy sauce, chili sauce, and vinegar.",
//           "Toss the fried cauliflower florets in the sauce until evenly coated.",
//           "Garnish with chopped spring onions and serve hot."
//         ],
//         "ingredients": [
//           "Cauliflower, cut into florets",
//           "Corn flour",
//           "All-purpose flour",
//           "Ginger-garlic paste",
//           "Soy sauce",
//           "Chili sauce",
//           "Vinegar",
//           "Green chilies, chopped",
//           "Spring onions, chopped",
//           "Salt to taste",
//           "Oil for frying"
//         ],
//         "category": "Snacks", 
//         "image": "gobi-manchurian.jpg"
//       },
//       { 
//         "name": "Chakli",
//         "description": "Chakli, also known as murukku, is a crispy South Indian snack made with rice flour, gram flour, and spices, shaped into spirals and deep-fried to perfection.",
//         "instructions": [
//           "Prepare the dough by mixing rice flour, gram flour, cumin seeds, sesame seeds, red chili powder, and salt with water to form a stiff dough.",
//           "Fill the chakli maker with the dough and press out spiral shapes onto a greased surface.",
//           "Deep fry the spirals in hot oil until golden brown and crispy.",
//           "Allow them to cool before storing in an airtight container."
//         ],
//         "ingredients": [
//           "Rice flour",
//           "Gram flour (besan)",
//           "Cumin seeds",
//           "Sesame seeds",
//           "Red chili powder",
//           "Salt to taste",
//           "Oil for frying"
//         ],
//         "category": "Snacks", 
//         "image": "chakli.jpg"
//       },
//       { 
//         "name": "Paneer Puff",
//         "description": "Paneer Puff is a flaky and savory pastry filled with a spiced paneer mixture, perfect as a tea-time snack.",
//         "instructions": [
//           "Prepare the paneer filling by sautéing crumbled paneer with onions, green chilies, and spices until aromatic.",
//           "Roll out puff pastry dough into squares and place a spoonful of the paneer filling in the center of each square.",
//           "Fold the pastry squares to form triangles, sealing the edges with a fork.",
//           "Brush the tops of the puff pastry with beaten egg for a golden finish.",
//           "Bake in a preheated oven until the puff pastry is golden and flaky.",
//           "Serve hot with ketchup or chutney."
//         ],
//         "ingredients": [
//           "Puff pastry dough",
//           "Paneer (Indian cottage cheese), crumbled",
//           "Onion, finely chopped",
//           "Green chilies, chopped",
//           "Ginger-garlic paste",
//           "Turmeric powder",
//           "Coriander powder",
//           "Garam masala",
//           "Salt to taste",
//           "Egg, beaten (for egg wash)"
//         ],
//         "category": "Snacks", 
//         "image": "paneer-puff.jpg"
//       },
//       { 
//         "name": "Dahi Kachori",
//         "description": "Dahi Kachori is a popular North Indian street food snack consisting of crispy hollow puris filled with a spicy potato mixture, topped with yogurt, chutneys, and sev.",
//         "instructions": [
//           "Prepare the kachoris by deep-frying small puris until golden brown and crispy.",
//           "Prepare the potato filling by mixing boiled and mashed potatoes with spices and chopped coriander leaves.",
//           "Poke a hole in the center of each kachori and fill it with the potato mixture.",
//           "Top the filled kachoris with beaten yogurt, tamarind chutney, green chutney, and sev.",
//           "Garnish with chopped coriander leaves and serve immediately."
//         ],
//         "ingredients": [
//           "Pani puris (hollow crispy puris)",
//           "Potatoes, boiled and mashed",
//           "Onion, finely chopped",
//           "Green chilies, chopped",
//           "Coriander leaves, chopped",
//           "Chaat masala",
//           "Black salt",
//           "Roasted cumin powder",
//           "Yogurt",
//           "Tamarind chutney",
//           "Green chutney",
//           "Sev (fried gram flour noodles)"
//         ],
//         "category": "Snacks", 
//         "image": "dahi-kachori.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('Error:', error);
//   }
// }

// insertSnacksRecipes();








