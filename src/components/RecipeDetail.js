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

  // Function to split the instructions into individual steps
  const getInstructionSteps = (instructions) => {
    // If instructions exist, split the string by either newlines or <li> tags
    if (!instructions) return [];
    const steps = instructions.split(/(?:\r\n|\r|\n)/); // Split by newlines
    return steps.filter(step => step.trim() !== ''); // Remove empty steps
  };

  const instructionSteps = getInstructionSteps(recipe.instructions);

  return (
    <div>
      <h1>{recipe.title}</h1>
      <img className="recipe-detail-image" src={recipe.image} alt={recipe.title} />
      
      {/* Display extra recipe details */}
      <h3>Servings</h3>
      <p>{recipe.servings}</p>

      <h3>Ready In</h3>
      <p>{recipe.readyInMinutes} minutes</p>

      {/* Conditionally render cooking and preparation minutes if they exist */}
      {recipe.cookingMinutes && (
        <>
          <h3>Cooking Time</h3>
          <p>{recipe.cookingMinutes} minutes</p>
        </>
      )}

      {recipe.preparationMinutes && (
        <>
          <h3>Preparation Time</h3>
          <p>{recipe.preparationMinutes} minutes</p>
        </>
      )}

      <h3>Dish Type</h3>
      <p>{recipe.dishTypes.join(', ')}</p> {/* Join dishTypes array into a string */}

      {/* Conditionally render Health Information */}
      {recipe.vegetarian || recipe.dairyFree ? (
        <>
          <h3>Health Information</h3>
          <p>
            {recipe.vegetarian ? 'Vegetarian' : ''} {recipe.dairyFree ? 'Dairy-Free' : ''}
          </p>
        </>
      ) : null}

      <h3>Ingredients</h3>
      <ul>
        {recipe.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.name} - {ingredient.amount} {ingredient.unit}</li>
        ))}
      </ul>

      <h3>Instructions</h3>
      {/* Map over the instruction steps and render them as a numbered list */}
      <ol>
        {instructionSteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeDetail;