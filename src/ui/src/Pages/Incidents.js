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
import Tooltip from '@mui/material/Tooltip';
import Paper from "@mui/material/Paper";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from '@mui/x-charts';

// Bar chart settings
const chartSetting = {
  yAxis: [
    {
      label: 'Number of Incidents',
      tickMinStep: 1,
    },
  ],
  width: 650,
  height: 350,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

const Incidents = (props) => {
  // Get ASV as route parameter and store for querying
  const data = useParams();
  let asvID = data.asvid;

  // Get and store the name of the ASV selected
  const asvName = getAsvTitleById(props.rows, 'asv_id', asvID);

  // State variable to store the API data
  const [incRows, setIncRows] = useState();

  // API call to get incident table data based on ASV ID
  useEffect(() => {
    axios.get(`http://localhost:8080/api/asv/${asvID}/incidents`)
    .then(res => {
      setIncRows(res.data);
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
    ? [...incRows].sort((a, b) => {
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
    : incRows;

  let allCounts, dataset, open = 0, resolved = 0, inprog = 0;

  if (incRows) {
    console.log(incRows);
    // Get the counts of the states for each incident
    allCounts = countIncidentStates(incRows);
    open = allCounts.Open;
    resolved = allCounts.Resolved;
    inprog = allCounts.InProg;

    // Get the data for the bar graph
    dataset = getSixMonthData(incRows);
  }

  return (
    <>
      <NavBar page="incidents" asvTitle={`${asvName} (${asvID})`} />
      <div className="grid-wrapper">
        <div className="top-wrapper">
          <div className="top-item grid-item">
            <h2>Open Incidents</h2>
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
            <h2>Six-Month Incident Totals</h2>
            <div className="bar-container">
              {incRows && (
                <BarChart
                  colors={["mediumturquoise", "seagreen"]}
                  dataset={dataset}
                  xAxis={[{ scaleType: "band", dataKey: "month" }]}
                  series={[
                    { dataKey: "open", label: "Open" },
                    { dataKey: "closed", label: "Closed" },
                  ]}
                  {...chartSetting}
                />
              )}
            </div>
          </div>
        </div>
        <div className="grid-item">
          <div className="table-container">
            <TableContainer className="table-container" component={Paper}>
              <Table
                stickyHeader
                sx={{ minWidth: 450 }}
                aria-label="incidents table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "incident_id"}
                        direction={orderBy === "incident_id" ? order : "asc"}
                        onClick={() => handleSortRequest("incident_id")}
                      >
                        Incident ID
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
                        active={orderBy === "assignment_group"}
                        direction={
                          orderBy === "assignment_group" ? order : "asc"
                        }
                        onClick={() => handleSortRequest("assignment_group")}
                      >
                        Assignment Group
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
                        active={orderBy === "priority"}
                        direction={orderBy === "priority" ? order : "asc"}
                        onClick={() => handleSortRequest("priority")}
                      >
                        Priority
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "state"}
                        direction={orderBy === "state" ? order : "asc"}
                        onClick={() => handleSortRequest("state")}
                      >
                        State
                      </TableSortLabel>
                    </TableCell>
                    <Tooltip title="Machine Generated Data">
                      <TableCell align="left">
                        <TableSortLabel
                          active={orderBy === "predicted_state"}
                          direction={
                            orderBy === "predicted_state" ? order : "asc"
                          }
                          onClick={() => handleSortRequest("predicted_state")}
                        >
                         Six Month <br/> Predicted State
                        </TableSortLabel>
                      </TableCell>
                    </Tooltip>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "open_date"}
                        direction={orderBy === "open_date" ? order : "asc"}
                        onClick={() => handleSortRequest("open_date")}
                      >
                        Open Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "close_date"}
                        direction={orderBy === "close_date" ? order : "asc"}
                        onClick={() => handleSortRequest("close_date")}
                      >
                        Close Date
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incRows &&
                    sortedRows.map((row) => (
                      <TableRow
                        hover
                        key={row.incident_id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.incident_id}
                        </TableCell>
                        <TableCell align="left">{row.description}</TableCell>
                        <TableCell align="left">
                          {row.application_name}
                        </TableCell>
                        <TableCell align="left">
                          {row.assignment_group}
                        </TableCell>
                        <TableCell align="left">{row.employee_id}</TableCell>
                        <TableCell align="left">{row.priority}</TableCell>
                        <TableCell align="left">{row.state}</TableCell>
                        <TableCell align="left">
                          {row.predicted_state}
                        </TableCell>
                        <TableCell align="left">
                          {row.open_date.slice(0, -13)}
                        </TableCell>
                        <TableCell align="left">
                          {row.close_date ? row.close_date.slice(0, -13) : ""}
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

export default Incidents;


// ****************** HELPER FUNCTIONS ****************** //

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

// Function that counts the state totals and returns them in an object with counts.
function countIncidentStates (arr) {
  let openCount = 0, inProgCount = 0, resolvedCount = 0;

  // Iterate through each object in the array
  for (const obj of arr) {
    // Check status text and increment respective counter
    switch (obj['state']) {
      case 'Open':
        openCount++;
        break;
      case 'In progress':
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

// Gets the previous six month counts for open and closed incidents
function getSixMonthData(arr) {
  // Default chart data
  const dataset = [
    {
      open: 0,
      closed: 0,
      month: "Oct",
    },
    {
      open: 0,
      closed: 0,
      month: "Nov",
    },
    {
      open: 0,
      closed: 0,
      month: "Dec",
    },
    {
      open: 0,
      closed: 0,
      month: "Jan",
    },
    {
      open: 0,
      closed: 0,
      month: "Feb",
    },
    {
      open: 0,
      closed: 0,
      month: "Mar",
    },
  ];

  // For each incident
  for (const obj of arr) {
    // Get the month of the current incident
    let month = getMonthAbbreviation(obj['open_date']);

    for (let i = 0; i < dataset.length; i++) {
      // Find the month in the dataset variable
      if (dataset[i].month === month) {
        // If it's null, increment the open count
        if (obj['close_date'] === null) {
          dataset[i].open += 1;
        } else {
          // If not null, then increment the closed count
          dataset[i].closed += 1;
        }
      }
    }
  }
  // Return the resulting array
  return dataset;
}

// Function that takes the date string from the DB and returns the abbreviated month text
function getMonthAbbreviation(dateString) {
  // Create a Date object from the provided string
  const date = new Date(dateString);
  
  // Get the month abbreviation using toLocaleDateString()
  const monthAbbreviation = date.toLocaleDateString('en-US', { month: 'short' });
  
  return monthAbbreviation;
}