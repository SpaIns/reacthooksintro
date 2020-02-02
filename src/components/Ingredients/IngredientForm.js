import React, { useState } from 'react';
import LoadingIndicator from '../UI/LoadingIndicator'

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  // Init w/ default state that is any value/object
  // Returns an array with exactly 2 element.
  // 1) Current state snapshot for this re-render
  // 2) Function that allows update of current state
  //    Updated state by replacing entire state. Not just a portion of state
  const [enteredTitle, setEnteredTitle] = useState('')
  // Above is an example of array destructuring; ES6 feature
  const [enteredAmount, setEnteredAmount] = useState('')

  // Can't use hooks in other functions, or conditional statements; must be root level.
  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount})
  };

  // Note we need to do onChange using prev state, since using cur state
  //opens us up to errors re: react not updating state instantly/inorder
  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={enteredTitle}
            onChange={event => {
              setEnteredTitle(event.target.value)
              }
            }/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={enteredAmount}
            onChange={event => {
              setEnteredAmount(event.target.value)
              }}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator/> }
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
