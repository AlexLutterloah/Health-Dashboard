import React from 'react';
import './NavBar.css';
import MainHeader from './MainHeader';
import { Link, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


const NavBar = ({ page = "exceptions", asvTitle }) => {
  const data = useParams();
  let asvID = data.asvid;

  return (
    <div>
      <MainHeader titleText={asvTitle} userName={"John Smith"}>
        <Link to="/overview">Home</Link>
      </MainHeader>
      <div className="exceptions-container">
        <div className="navbar-container">
          <Stack className="button-container" spacing={7} direction="row">
            <Button component={Link} to={"/"+asvID+"/exceptions"} className="button-style" variant="contained" sx={{bgcolor: page === "exceptions" ? '#002b48' : '#004879'}}>Exceptions</Button>
            <Button component={Link} to={"/"+asvID+"/incidents"} className="button-style" variant="contained" sx={{bgcolor: page === "incidents" ? '#002b48' : '#004879'}}>Incidents</Button>
            <Button component={Link} to={"/"+asvID+"/security"}className="button-style" variant="contained" sx={{bgcolor: page === "security" ? '#002b48' : '#004879'}}>Security</Button>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
