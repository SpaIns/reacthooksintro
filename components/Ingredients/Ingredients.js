import React, {useReducer, useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'


// Typically create reducer outside function to decouple it
const ingReducer = (currentIngs, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngs, action.ingredient]
    case 'DELETE':
      return currentIngs.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get here')
  }
}

// Remember this is state management
const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error: null}
    case 'RESPONSE':
      return {...httpState, loading: false}
    case 'ERROR':
      return {loading: false, error: action.error}
    case 'CLEAR':
      return {...httpState, error: null}
    default:
      throw new Error('Should not get here')
  }
}

// could also be written const ing = () => 
function Ingredients() {
  // Takes reducer and starting state
  const [userIngs, dispatch] = useReducer(ingReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null})
  // const [ings, setIngs] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState()
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
    console.log('RENDERING', userIngs)
  }, [userIngs])
  // ^ means only re-runs when ings changes

  // If you fetch as you render, the state updates. Then re-renders. Then you fetch
  // End up in infinite loop, thus use useEffect


  // Use callback takes 2 args; the function, and the dependecies of it
  // Caches then function for re-render cycles unless dependancy changes
  const filterIngsHandler = useCallback((filteredIngs) => {
    dispatch({type: 'SET', ingredients: filteredIngs})
    // setIngs(filteredIngs)
  }, [])

  const addIngHandler = ingredient => {
    dispatchHttp({type: 'SEND'})
    // Fetch by default sends GET request; firebase requires POST
    fetch(firebase_url + 'ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'},
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'})
      // We want the json version of the response; another promise returned
      return response.json().then(responseData => {
        // Response data will contain ID firebase generates
        // setIngs(prevIngs => [...prevIngs, 
        //   {id: responseData.name, ...ingredient}])
        dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
      })
    }).catch(err => {
      dispatchHttp({type: 'ERROR', error: err.message})
      console.log(err)
    })
  }

  // Removes ingredient from list on click. Use ID as thing
  const removeIngHandler = (ingId)=> {
    dispatchHttp({type: 'SEND'})
    fetch(`${firebase_url}ingredients/${ingId}.json`, {
      method: 'DELETE',
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'})
      dispatch({type: 'DELETE', id: ingId})
    }).catch(err => {
      dispatchHttp({type: 'ERROR', error: err.message})
      console.log(err)
    })
  }

  const clearError = () => {
    dispatchHttp({type: 'CLEAR'})
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngs={filterIngsHandler}/>
        <IngredientList ingredients={userIngs} onRemoveItem={removeIngHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
