// src/components/Filter.js
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaSlidersH } from 'react-icons/fa';

const Filter = ({ setCuisine, setDiet, setIntolerances, handleSearch }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [cuisine, setCuisineState] = useState('');
  const [diet, setDietState] = useState('');
  const [intolerances, setIntolerancesState] = useState('');

  const cuisines = [
    'All Cuisines','African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 
    'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 
    'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 
    'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 
    'Spanish', 'Thai', 'Vietnamese'
  ];

  const handleApplyFilters = () => {
    setCuisine(cuisine);
    setDiet(diet);
    setIntolerances(intolerances);
    handleSearch();
  };

  return (
    <>
      <Button onClick={() => setShowFilter(!showFilter)} className="filter-btn">
        <FaSlidersH /> Filter
      </Button>

      {showFilter && (
        <div className="filter-box">
            <div>
            <Form.Control
                as="select"
                value={cuisine}
                onChange={(e) => setCuisineState(e.target.value)}
                style={{ marginTop: '10px' }}
            >
                {cuisines.map((cuisineOption) => (
                <option key={cuisineOption} value={cuisineOption}>
                    {cuisineOption}
                </option>
                ))}
            </Form.Control>

            <Form.Control
                as="select"
                value={diet}
                onChange={(e) => setDietState(e.target.value)}
                style={{ marginTop: '10px' }}
            >
                <option value="">All Diets</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="glutenFree">Gluten-Free</option>
                <option value="paleo">Paleo</option>
                <option value="ketogenic">Ketogenic</option>
                <option value="lowFodmap">Low-FODMAP</option>
                <option value="whole30">Whole30</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="primal">Primal</option>
            </Form.Control>

            <Form.Control
                as="select"
                value={intolerances}
                onChange={(e) => setIntolerancesState(e.target.value)}
                style={{ marginTop: '10px' }}
            >
                <option value="">All Intolerances</option>
                <option value="dairy">Dairy</option>
                <option value="gluten">Gluten</option>
                <option value="egg">Egg</option>
                <option value="peanut">Peanut</option>
                <option value="treeNut">Tree Nut</option>
                <option value="soy">Soy</option>
                <option value="fish">Fish</option>
                <option value="shellfish">Shellfish</option>
            </Form.Control>
          </div>

          <div>

            <Button className="apply-reset-btns" onClick={handleApplyFilters} style={{ marginTop: '10px' }}>
                Apply Filters
            </Button>
            <Button className="apply-reset-btns" onClick={() => { setCuisine(''); setDiet(''); setIntolerances(''); }} style={{ marginTop: '10px' }}>
                Reset Filters
            </Button>
        </div>
        </div>
      )}
    </>
  );
};

export default Filter;
