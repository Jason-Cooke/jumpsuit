import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory, hashHistory } from 'react-router'
//
import { CreateJumpstateMiddleware } from 'jumpstate'

let userMiddleware = []

export function Middleware (...newMiddleware) {
  userMiddleware = [...userMiddleware, ...newMiddleware]
}

export let STORE

export function combine (states, options = {}) {
  const nativeMiddleware = applyMiddleware(
    routerMiddleware(options.useHash ? hashHistory : browserHistory),
    ...userMiddleware,
    CreateJumpstateMiddleware()
  )
  const enhancers = [nativeMiddleware]

  if (process.env.NODE_ENV !== 'production') {
    const devTools = require('./devtools')
    const devToolsExtension = devTools.default.instrument({
      maxAge: Number(process.env.HSR_MAX_AGE),
      shouldCatchErrors: Boolean(process.env.HSR_SHOULD_CATCH_ERRORS)
    })
    enhancers.push(devToolsExtension)
  }

  const enhancer = compose(...enhancers)
  const rootReducer = combineReducers(states)

  const store = createStore(rootReducer, enhancer)
  STORE = store

  return store
}
