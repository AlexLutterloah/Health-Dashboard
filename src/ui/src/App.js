import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios';

import Login from './Pages/Login';
import CreateAccount from './Pages/CreateAccount';
import Overview from './Pages/Overview';
import Exceptions from './Pages/Exceptions';
import Incidents from './Pages/Incidents';
import Security from './Pages/Security';

function App() {

  // State variable to hold ASV table data
  const [asvRows, setAsvRows] = useState('');

  // API call to get ASV table data.
  useEffect(() => {
    axios.get('http://localhost:8080/api/asv')
    .then(res => {
      setAsvRows(res.data);
    });
  }, []);

  return (
    <div className="App">
      <main className="main-content">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route path="/overview" element={<Overview rows={asvRows} />} />
            <Route path="/:asvid/exceptions" element={<Exceptions rows={asvRows} />} />
            <Route path="/:asvid/incidents" element={<Incidents rows={asvRows} />} />
            <Route path="/:asvid/security" element={<Security rows={asvRows} />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
};

export default App;
