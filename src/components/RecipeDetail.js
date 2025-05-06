import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_KEY from '../config'; 


const RecipeDetail = () => {
  const { id } = useParams(); // Get the dynamic 'id' from the URL
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
          params: { apiKey: API_KEY },
        });
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    if (id) {
      fetchRecipeDetails(); // Only fetch if there's an id
    }
  }, [id]); // Re-run effect when the id changes

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <h3>Health Information</h3>
      <p>{recipe.vegetarian ? 'Vegetarian' : ''} {recipe.dairyFree ? 'Dairy-Free' : ''}</p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.name} - {ingredient.amount} {ingredient.unit}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default RecipeDetail;
