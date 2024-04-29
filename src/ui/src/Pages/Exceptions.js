import React, { useState, useEffect } from 'react';
import './ExIncSec.css';
import NavBar from '../Components/NavBar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// MUI components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { PieChart } from "@mui/x-charts/PieChart";

// Function to get the name of the ASV by ID
function getAsvTitleById(array, key, targetValue) {
  for (const obj of array) {
      if (obj[key] == targetValue) {
          return obj['asv_name'];
      }
  }
  // If value not found, return null or appropriate value
  return null;
}

// Function that counts the status totals and returns them in an object with counts.
function countExceptionStatus (arr) {
  let openCount = 0, inProgCount = 0, resolvedCount = 0;

  // Iterate through each object in the array
  for (const obj of arr) {
    // Check status text and increment respective counter
    switch (obj['status']) {
      case 'Open':
        openCount++;
        break;
      case 'In Progress':
        inProgCount++;
        break;
      case 'Resolved':
        resolvedCount++
        break;
    }
  }

  // Store the counts in an object
  const counts = {
    Open: openCount,
    InProg: inProgCount,
    Resolved: resolvedCount,
  }

  // Return object of counts
  return counts;
}

const Exceptions = (props) => {
  // Get ASV as route parameter and store for querying
  const data = useParams();
  let asvID = data.asvid;

  // Get and store the name of the ASV selected
  const asvName = getAsvTitleById(props.rows, 'asv_id', asvID);

  // State variable to store the API data
  const [exRows, setExRows] = useState();
  const [appNames, setAppNames] = useState();

  // API call to get exception table data based on ASV ID
  useEffect(() => {
    axios.get(`http://localhost:8080/api/asv/${asvID}/exceptions`)
    .then(res => {
      setExRows(res.data);
    });
  }, [asvID]);

  // API call to get application table data based on ASV ID
  useEffect(() => {
    axios.get(`http://localhost:8080/api/asv/${asvID}/applications`)
    .then(res => {
      setAppNames(res.data);
    });
  }, [asvID]);

  // Used for table sorting
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRows = orderBy
    ? [...exRows].sort((a, b) => {
        // Handle null values by placing them at the end (you can adjust as needed)
        if (a[orderBy] === null && b[orderBy] === null) return 0;
        if (a[orderBy] === null) return 1;
        if (b[orderBy] === null) return -1;
        // Normal comparison for non-null values
        if (order === "asc") {
          return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1;
        }
      })
    : exRows;

  // Get the counts of the statuses for each exception
  let allCounts, open = 0, resolved = 0, inprog = 0;
  if (exRows) {
    allCounts = countExceptionStatus(exRows);
    open = allCounts.Open;
    resolved = allCounts.Resolved;
    inprog = allCounts.InProg;
  }

  return (
    <>
      <NavBar page="exceptions" asvTitle={`${asvName} (${asvID})`} />
      <div className="grid-wrapper">
        <div className="top-wrapper">
          <div className="top-item grid-item">
            <h2>Overall Exception Status</h2>
            <div className="pie-container">
              <PieChart
                colors={["darkgreen", "gold", "firebrick"]}
                series={[
                  {
                    data: [
                      { id: 0, value: resolved, label: "Resolved" },
                      { id: 1, value: inprog, label: "In Progress" },
                      { id: 2, value: open, label: "Open" },
                    ],
                    innerRadius: 60,
                    paddingAngle: 2,
                    cornerRadius: 5,
                  },
                ]}
                width={650}
                height={250}
              />
            </div>
          </div>
          <div className="top-item grid-item">
            <h2>Application List</h2>
            {appNames &&
              appNames.map((row) => (
                <ul key={row.application_id}>{row.application_name}</ul>
              ))}
          </div>
        </div>
        <div className="grid-item">
          <div className="table-container">
            <TableContainer className="table-container" component={Paper}>
              <Table
                stickyHeader
                sx={{ minWidth: 450 }}
                aria-label="exception table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "exception_id"}
                        direction={orderBy === "exception_id" ? order : "asc"}
                        onClick={() => handleSortRequest("exception_id")}
                      >
                        Exception ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "application_name"}
                        direction={
                          orderBy === "application_name" ? order : "asc"
                        }
                        onClick={() => handleSortRequest("application_name")}
                      >
                        Application Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "employee_id"}
                        direction={orderBy === "employee_id" ? order : "asc"}
                        onClick={() => handleSortRequest("employee_id")}
                      >
                        Employee ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "status"}
                        direction={orderBy === "status" ? order : "asc"}
                        onClick={() => handleSortRequest("status")}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "risk_score"}
                        direction={orderBy === "risk_score" ? order : "asc"}
                        onClick={() => handleSortRequest("risk_score")}
                      >
                        Risk Score
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "open_date"}
                        direction={orderBy === "open_date" ? order : "asc"}
                        onClick={() => handleSortRequest("open_date")}
                      >
                        Open Date
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exRows &&
                    sortedRows.map((row) => (
                      <TableRow
                        hover
                        key={row.exception_id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.exception_id}
                        </TableCell>
                        <TableCell align="left">{row.description}</TableCell>
                        <TableCell align="left">
                          {row.application_name}
                        </TableCell>
                        <TableCell align="left">{row.employee_id}</TableCell>
                        <TableCell align="left">{row.status}</TableCell>
                        <TableCell align="left">{row.risk_score}</TableCell>
                        <TableCell align="left">
                          {row.open_date.slice(0, -13)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Exceptions;
