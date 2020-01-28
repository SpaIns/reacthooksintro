import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  // Init w/ default state that is any value/object
  // Returns an array with exactly 2 element.
  // 1) Current state snapshot for this re-render
  // 2) Function that allows update of current state
  //    Updated state by replacing entire state. Not just a portion of state
  const [inputState, setInputState] = useState({title: '', amount: ''})
  // Above is an example of array destructuring; ES6 feature

  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  // Note we need to do onChange using prev state, since using cur state
  //opens us up to errors re: react not updating state instantly/inorder
  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={inputState.title}
            onChange={event => {
              // Since event isn't always updating the way that might
              // be intuitive, we need to store it seperately
              // to prevent errors where the inner function
              // doesn't have access to the current event
              const newTitle = event.target.value
              setInputState((prevInputState) => 
              ({title: newTitle, amount: prevInputState.amount})
              )
            }
            }/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={inputState.amount}
            onChange={event => {
              const newAmount = event.target.value
              setInputState((prevInputState) => 
              ({title: prevInputState.title, amount: newAmount}))
              }}/>
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
