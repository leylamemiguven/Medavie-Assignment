// Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import API_KEY from '../config';


const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1); // Track the current page
    const [totalPages, setTotalPages] = useState(1); // Track total pages
  
    // Function to handle search
    const handleSearch = async () => {
      if (!searchTerm) {
        console.log('Please enter a search term.');
        return;
      }
  
      // Reset recipes when a new search is made or page is changed
      setRecipes([]);
  
      try {
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
          params: {
            apiKey: process.env.REACT_APP_API_KEY,
            query: searchTerm,
            number: 5,
            offset: (page - 1) * 5, // Adjust offset based on page number
          },
        });
  
        console.log('API Response:', response.data); // Debugging response
        setRecipes(response.data.results); // Set new search results
        setTotalPages(Math.ceil(response.data.totalResults / 5)); // Calculate total pages
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    // Handle Enter key press
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch(); // Trigger the search when Enter is pressed
      }
    };
  
    // Function to handle pagination
    const handleNext = () => {
      if (page < totalPages) {
        setPage(prevPage => prevPage + 1);
      }
    };
  
    const handlePrevious = () => {
      if (page > 1) {
        setPage(prevPage => prevPage - 1);
      }
    };
  
    return (
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
          onKeyDown={handleKeyPress} // Listen for Enter key press
          placeholder="Search for a recipe"
        />
        <button onClick={handleSearch}>Search</button> {/* Trigger search on button click */}
  
        <div>
          {recipes.length === 0 ? (
            <p>No results found</p>
          ) : (
            <ul>
              {recipes.map((recipe) => (
                <li key={recipe.id}>
                  <h3>{recipe.title}</h3>
                  <img src={recipe.image} alt={recipe.title} />
                  <button onClick={() => window.location.href = `/recipe/${recipe.id}`}>View Recipe</button>
                </li>
              ))}
            </ul>
          )}
        </div>
  
        {/* Pagination Controls */}
        <div>
          <button onClick={handlePrevious} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={handleNext} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>
    );
  };
  
  export default Home;