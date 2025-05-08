import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Filter from '../components/Filter';
import { FaArrowRight } from 'react-icons/fa'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [cuisine, setCuisine] = useState(''); // Track selected cuisine filter
  const [diet, setDiet] = useState('');
  const [intolerances, setIntolerances] = useState('');
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been made

  // Function to handle search
  const handleSearch = async () => {
    if (!searchTerm) {
      console.log('Please enter a search term.');
      return;
    }

    // Reset recipes when a new search is made or page is changed
    setRecipes([]);
    setHasSearched(true); // Mark that a search has been made

    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          apiKey: process.env.REACT_APP_API_KEY,
          query: searchTerm,
          cuisine: cuisine !== 'All' ? cuisine : '',
          diet: diet || '',
          intolerances: intolerances || '',
          number: 5,
          offset: (page - 1) * 5, // Adjust offset based on page number
        },
      });

      console.log('API Response:', response.data);
      setRecipes(response.data.results); // Set new search results
      setTotalPages(Math.ceil(response.data.totalResults / 5)); // Calculate total pages
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger the search when Enter is pressed
    }
  };

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

  useEffect(() => {
    if (hasSearched) {
      handleSearch(); // Run the search whenever page, cuisine, diet, or intolerances changes after a search
    }
    // eslint-disable-next-line
  }, [page, cuisine, diet, intolerances, hasSearched]);

  return (
    <Container className="main-content">
      <h1>Search Recipe</h1>
      <Row>
        <p>Search for a recipe by typing a food type (e.g., pasta, sushi, hamburger)</p>
        <Col>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
            onKeyDown={handleKeyPress} // Listen for Enter key press
            placeholder="Search for a recipe"
          />
          <Button className="search-btn" onClick={handleSearch}>Search</Button>
        </Col>
      </Row>

      {/* Render Filter Component */}
      {hasSearched && <Filter setCuisine={setCuisine} setDiet={setDiet} setIntolerances={setIntolerances} handleSearch={handleSearch} />}

      <Row>
        {hasSearched && recipes.length === 0 && <p>No results found</p>}
        {recipes.map((recipe) => (
          <Col onClick={() => window.location.href = `/recipe/${recipe.id}`} key={recipe.id} sm={12} md={6} lg={4} className="mb-4">
            <div className="recipe-card">
              <img src={recipe.image} alt={recipe.title} />
              <div className="recipe-card-content">
                <div className="recipe-card-title">
                  <h3>{recipe.title}</h3>
                  <FaArrowRight
                    className="view-recipe-arrow"
                  />
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Pagination Controls */}
      {hasSearched && totalPages > 1 && (
        <Row>
          <Col>
            <Button className="pagination-btns" onClick={handlePrevious} disabled={page === 1}>
              &lt;
            </Button>
            <span>Page {page} of {totalPages}</span>
            <Button className="pagination-btns" onClick={handleNext} disabled={page === totalPages}>
              &gt;
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;
