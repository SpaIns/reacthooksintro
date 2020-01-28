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

  // Removes ingredient from list on click. Use ID as thing
  const removeIngHandler = (ingId)=> {
    // First, create a copy of the ings and remove ing with id ingId
    // ings.find((ing) => (ing.id === ingId))
      // Not needed; close though. just filter, since filter returns a copy
    setIngs(prevIngs => prevIngs.filter((ing) => ing.id !== ingId))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={ings} onRemoveItem={removeIngHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
