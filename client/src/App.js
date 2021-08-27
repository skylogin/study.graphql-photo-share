import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AuthorizedUser from './components/AuthorizedUser';
import Users from './components/Users';

const App = () => 
  <BrowserRouter>
    <div>
      <AuthorizedUser />
      <Users />
    </div>
  </BrowserRouter>
;

export default App; 