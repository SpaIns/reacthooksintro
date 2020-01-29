import React, {useState, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'

// could also be written const ing = () => 
function Ingredients() {
  const [ings, setIngs] = useState([])
  const firebase_url = process.env.REACT_APP_FIREBASE_HOOKS
  const fetchIngsUrl = firebase_url + 'ingredients.json'

  // Used to manage side effects - such as HTTP requests
  // Triggered after every render cycle, for every render cycle.
  // Works like componentDidUpdate
  useEffect( () =>
    fetch(fetchIngsUrl).then(response => 
      response.json().then(responseData => {
        const loadedIngs = []
        for (const key in responseData) {
          loadedIngs.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          })
        }
        setIngs(loadedIngs)
      })
    ).catch(err => console.log(err)),
    // Second arg is array of dependencies.
    // If left empty, acts as componentDidMount;
    //  runs only once after first render
    [fetchIngsUrl]
  )

  // Can use useEffect/useState as much as you want.
  useEffect(() => {
    console.log('RENDERING', ings)
  }, [ings])
  // ^ means only re-runs when ings changes

  // If you fetch as you render, the state updates. Then re-renders. Then you fetch
  // End up in infinite loop, thus use useEffect

  const addIngHandler = ingredient => {
    // Fetch by default sends GET request; firebase requires POST
    fetch(firebase_url + 'ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'},
    }).then(response => {
      // We want the json version of the response; another promise returned
      return response.json().then(responseData => {
        // Response data will contain ID firebase generates
        setIngs(prevIngs => [...prevIngs, 
          {id: responseData.name, ...ingredient}])
      })
    }).catch(err => {
      console.log(err)
    })
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
