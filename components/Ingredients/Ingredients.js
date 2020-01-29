import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'

// could also be written const ing = () => 
function Ingredients() {
  const [ings, setIngs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const firebase_url = process.env.REACT_APP_FIREBASE_HOOKS
  // const fetchIngsUrl = firebase_url + 'ingredients.json'

  // Used to manage side effects - such as HTTP requests
  // Triggered after every render cycle, for every render cycle.
  // Works like componentDidUpdate
  // useEffect( () =>
  //   fetch(fetchIngsUrl).then(response => 
  //     response.json().then(responseData => {
  //       const loadedIngs = []
  //       for (const key in responseData) {
  //         loadedIngs.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         })
  //       }
  //       setIngs(loadedIngs)
  //     })
  //   ).catch(err => console.log(err)),
  //   // Second arg is array of dependencies.
  //   // If left empty, acts as componentDidMount;
  //   //  runs only once after first render
  //   [fetchIngsUrl]
  // )
  // Currently fetching ingredients in Search implicitly by doing a request
  // with no filter enabled at the start.

  // Can use useEffect/useState as much as you want.
  useEffect(() => {
    console.log('RENDERING', ings)
  }, [ings])
  // ^ means only re-runs when ings changes

  // If you fetch as you render, the state updates. Then re-renders. Then you fetch
  // End up in infinite loop, thus use useEffect


  // Use callback takes 2 args; the function, and the dependecies of it
  // Caches then function for re-render cycles unless dependancy changes
  const filterIngsHandler = useCallback((filteredIngs) => {
    setIngs(filteredIngs)
  }, [])

  const addIngHandler = ingredient => {
    setIsLoading(true)
    // Fetch by default sends GET request; firebase requires POST
    fetch(firebase_url + 'ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'},
    }).then(response => {
      setIsLoading(false)
      // We want the json version of the response; another promise returned
      return response.json().then(responseData => {
        // Response data will contain ID firebase generates
        setIngs(prevIngs => [...prevIngs, 
          {id: responseData.name, ...ingredient}])
      })
    }).catch(err => {
      setError(err.message)
      console.log(err)
    })
  }

  // Removes ingredient from list on click. Use ID as thing
  const removeIngHandler = (ingId)=> {
    setIsLoading(true)
    fetch(`${firebase_url}ingredients/${ingId}.json`, {
      method: 'DELETE',
    }).then(response => {
      setIsLoading(false)
      setIngs(prevIngs => prevIngs.filter((ing) => ing.id !== ingId))
    }).catch(err => {
      setError(err.message)
      console.log(err)
    })
  }

  const clearError = () => {
    setError(null)
    setIsLoading(false)
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngs={filterIngsHandler}/>
        <IngredientList ingredients={ings} onRemoveItem={removeIngHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
