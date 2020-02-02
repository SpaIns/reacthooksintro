import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http'
import ErrorModal from '../UI/ErrorModal'

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState('')
  const firebase_url = process.env.REACT_APP_FIREBASE_HOOKS
  const fetchIngsUrl = firebase_url + 'ingredients.json'
  const {isLoading, data, error, sendRequest, clear} = useHttp()
  
  /// Object destructuing
  const {onLoadIngs} = props

  // Get a reference via a hook
  const inputRef = useRef()

  // Set an HTTP request whenever the enteredFilter changes
  useEffect(() => {
    // Set a timer so we only update if the user stops to type
    // we only run request if update is static from last check
    const timer = setTimeout(() => {
      // EnteredFilter is set to equal whatever it was @ start of timer
      // use our ref from the hook to see current value
      if (enteredFilter === inputRef.current.value) {
        // Backticks let us add string interpolation
        const query = enteredFilter.length === 0 ? '' 
          : `?orderBy="title"&equalTo="${enteredFilter}"`
        sendRequest(fetchIngsUrl + query, 'GET')
      }
    },500)
    // We can return a cleanup function @ end of use effect; not required.
    // This function is run the next time useEffect is called.
    // If [] is passed as dependancies, cleanup called when component unmounts
    return () => {
      // Clear out our old timer before we set a new one
      // Stops us from creating a bunch of redundant timers in memory
      clearTimeout(timer)
    }
  }, [fetchIngsUrl, enteredFilter, inputRef, sendRequest])

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngs = []
      for (const key in data) {
        loadedIngs.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })
      }
      // Trigger something in Ingredients.js
      // Trigger changing of our ingredients.
        // B/c this will reload Ings, Search is reloaded
        // Thus, useCallBack required on Ings.onLoad
      onLoadIngs(loadedIngs)
    }
  }, [data, isLoading, error, onLoadIngs])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input type="text" value={enteredFilter} 
          onChange={event => setEnteredFilter(event.target.value)}
          ref={inputRef}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
