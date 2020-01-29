import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState('')
  const firebase_url = process.env.REACT_APP_FIREBASE_HOOKS
  const fetchIngsUrl = firebase_url + 'ingredients.json'
  
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
        fetch(fetchIngsUrl + query).then(response => 
          response.json().then(responseData => {
            const loadedIngs = []
            for (const key in responseData) {
              loadedIngs.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              })
            }
            // Trigger something in Ingredients.js
            // Trigger changing of our ingredients.
              // B/c this will reload Ings, Search is reloaded
              // Thus, useCallBack required on Ings.onLoad
            onLoadIngs(loadedIngs)
          })
        ).catch(err => console.log(err))
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
  }, [fetchIngsUrl, enteredFilter, onLoadIngs, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={enteredFilter} 
          onChange={event => setEnteredFilter(event.target.value)}
          ref={inputRef}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
