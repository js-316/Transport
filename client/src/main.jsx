import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import {store} from './app/store'
import './index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { configureStore } from '@reduxjs/toolkit'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* all the components will be in the provider.. Store has all our data */}
    <Provider store={store} >
      <App />
    </Provider>
  </React.StrictMode>,
)
