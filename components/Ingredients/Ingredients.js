import React, {useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'

// could also be written const ing = () => 
function Ingredients() {
  const [ings, setIngs] = useState([])

  const addIngHandler = ingredient => {
    setIngs(prevIngs => [...prevIngs, 
      {id: Math.random().toString(), ...ingredient}])
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={ings} onRemoveItem={() => {}}/>
      </section>
    </div>
  );
}

export default Ingredients;
