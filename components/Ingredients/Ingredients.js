import React, {useReducer, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hooks/http'


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


// could also be written const ing = () => 
function Ingredients() {
  // Takes reducer and starting state
  const [userIngs, dispatch] = useReducer(ingReducer, [])
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useHttp()
  const firebase_url = process.env.REACT_APP_FIREBASE_HOOKS


  // Can use useEffect/useState as much as you want.
  useEffect(() => {
    // Only make these updates if we're no longer loading.
    // Check the identifier
    if (!isLoading && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra})
    }
    // otherwise it's an add request. Make sure we don't have an error condition
    else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: {id: data.name, ...reqExtra}
      })
    }
    // These are the only changes we make to ingredients for now.
    // This triggers on first page load too, but we don't need to handle it.
  }, [data, reqExtra, reqIdentifier, isLoading, error])
  // ^ means only re-runs when ings changes

  // If you fetch as you render, the state updates. Then re-renders. Then you fetch
  // End up in infinite loop, thus use useEffect


  // Use callback takes 2 args; the function, and the dependecies of it
  // Caches then function for re-render cycles unless dependancy changes
  const filterIngsHandler = useCallback((filteredIngs) => {
    dispatch({type: 'SET', ingredients: filteredIngs})
    // setIngs(filteredIngs)
  }, [])

  // This function shouldn't ever change, so we add useCallback w/ no dependancies 
  const addIngHandler = useCallback(ingredient => {
    sendRequest(firebase_url + 'ingredients.json', 'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT')
  }, [firebase_url, sendRequest])

  // Removes ingredient from list on click. Use ID as thing
  const removeIngHandler = useCallback((ingId)=> {
    // dispatchHttp({type: 'SEND'})
    sendRequest(`${firebase_url}ingredients/${ingId}.json`, 'DELETE',
      null, ingId, 'REMOVE_INGREDIENT')
  },[firebase_url, sendRequest])

  // Use memo saves a value
  // Second arg tells React when to update the memoized value, based on when a dependency updates
  // There's a slight cost to it, so only need to use it when it might be a heavier process
  const ingredientList = useMemo(() =>{
    return <IngredientList ingredients={userIngs} onRemoveItem={removeIngHandler}/>
  }, [userIngs, removeIngHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngs={filterIngsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
