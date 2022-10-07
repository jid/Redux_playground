import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store'
import { fetchUsers } from './features/users/usersSlice'
// import { fetchPosts } from './features/posts/postsSlice'
import { extendedApiSlice } from './features/posts/postsSlice';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

store.dispatch(fetchUsers())
// store.dispatch(fetchPosts())
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate())

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
