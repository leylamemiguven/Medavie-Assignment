import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import API_KEY from '../config';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [cuisine, setCuisine] = useState(''); // Track selected cuisine filter

  const cuisines = [
    'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 
    'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 
    'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 
    'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 
    'Spanish', 'Thai', 'Vietnamese'
  ];

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
          cuisine: cuisine !== 'All' ? cuisine : '', // Apply cuisine filter if not "All"
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
      setPage(prevPage => prevPage + 1); // Update page state to next page
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1); // Update page state to previous page
    }
  };

  // Trigger search whenever page, or cuisine changes
  useEffect(() => {
    handleSearch();
  }, [page, cuisine]); // Run the search whenever page, or cuisine changes

  return (
    <Container>
      Search Recipe
      <Row>
        <Col>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
            onKeyDown={handleKeyPress} // Listen for Enter key press
            placeholder="Search for a recipe"
          />
          <Button onClick={handleSearch}>Search</Button>

          <Form.Control
            as="select"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)} // Update cuisine filter
            style={{ marginTop: '10px' }}
          >
            {cuisines.map((cuisineOption) => (
              <option key={cuisineOption} value={cuisineOption}>
                {cuisineOption}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>

      <Row>
        {recipes.length === 0 ? (
          <p>No results found</p>
        ) : (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <h3>{recipe.title}</h3>
                <img src={recipe.image} alt={recipe.title} />
                <Button onClick={() => window.location.href = `/recipe/${recipe.id}`}>View Recipe</Button>
              </li>
            ))}
          </ul>
        )}
      </Row>

      {/* Pagination Controls */}
      <Row>
        <Col>
          <Button onClick={handlePrevious} disabled={page === 1}>
            Previous
          </Button>
          <span>Page {page} of {totalPages}</span>
          <Button onClick={handleNext} disabled={page === totalPages}>
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
