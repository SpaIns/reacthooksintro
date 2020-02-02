// Custom hook!
// This is logic that affects the state, but is reused pretty often
import { useReducer, useCallback } from 'react'


const initialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
}

// Remember this is state management
const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error: null, extra: null, identifier: action.identifier }
    case 'RESPONSE':
      return {...httpState, loading: false, data: action.responseData, extra: action.extra}
    case 'ERROR':
      return {loading: false, error: action.error}
    case 'CLEAR':
      return {initialState}
    default:
      throw new Error('Should not get here')
  }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)

    const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), [])

    // Wrap in use callback to avoid re-rendering unless smth changes
    const sendRequest = useCallback((url, method, body, extra, reqIdentifier) => {

        dispatchHttp({ type: 'SEND', identifier: reqIdentifier})
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            // Get response as data
            return response.json()
        })
        .then(responseData => {
            // Send the expected response data as an action to our reducer
            dispatchHttp({type: 'RESPONSE', responseData: responseData, extra: extra})
        })
        .catch(err => {
            dispatchHttp({type: 'ERROR', error: err.message})
            console.log(err)
        })
    }, [])
    // An alternative to the above is to simply return the fetch block.
    // We would then be able to utilize the promises it returns directly,
    // rather than via our hook

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear,
    }
}

export default useHttp;