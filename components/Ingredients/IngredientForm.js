import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  // Init w/ default state that is any value/object
  // Returns an array with exactly 2 element.
  // 1) Current state snapshot for this re-render
  // 2) Function that allows update of current state
  const inputState = useState({title: '', amount: ''})

  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={inputState[0].title}
            onChange={event => inputState[1]({title: event.target.value})}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={inputState[0].amount}
            onChange={event => inputState[1]({amount: event.target.value})}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
