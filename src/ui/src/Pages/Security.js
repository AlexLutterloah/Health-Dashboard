import React, { useState, useEffect } from 'react';
import "./ExIncSec.css";
import NavBar from "../Components/NavBar";
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
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from '@mui/x-charts';

// Bar chart settings
const chartSetting = {
  yAxis: [
    {
      label: 'Number of Security Risks',
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

const Security = (props) => {
  // Get ASV as route parameter and store for querying
  const data = useParams();
  let asvID = data.asvid;

  // Get and store the name of the ASV selected
  const asvName = getAsvTitleById(props.rows, 'asv_id', asvID);

  // State variable to store the API data
  const [secRows, setSecRows] = useState();

  // API call to get security table data based on ASV ID
  useEffect(() => {
    axios.get(`http://localhost:8080/api/asv/${asvID}/security`)
    .then(res => {
      setSecRows(res.data);
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
    ? [...secRows].sort((a, b) => {
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
    : secRows;
  
  // Variables for counts of the statuses for each security finding
  let allCounts, notStarted = 0, complete = 0, inProg = 0;

  // Variables for risk assessment graph values
  let riskScores, low = 0, med = 0, high = 0;

  // Variable for the bar chart for six month data
  let dataset;

  // If the state variable has data, run these two functions on the data
  if (secRows) {
    // Function to get security status counts for graph, and store the variables locally below.
    allCounts = countSecurityStatus(secRows);
    notStarted = allCounts.NotStarted;
    complete = allCounts.Complete;
    inProg = allCounts.InProg;

    // Function to get the risk assessment values for the graph, stores variables locally.
    riskScores = getRiskAssessmentValues(secRows);
    low = riskScores.Low;
    med = riskScores.Med;
    high = riskScores.High;

    // Function that gets the previous six month data for the bar chart
    dataset = getSixMonthData(secRows);
  }

  return (
    <>
      <NavBar page="security" asvTitle={`${asvName} (${asvID})`} />
      <div className="grid-wrapper">
        <div className="top-wrapper">
          <div className="top-item grid-item">
            <h2>Security Findings</h2>
            <div className="pie2-container">
              <PieChart
                colors={["darkgreen", "gold", "firebrick"]}
                series={[
                  {
                    data: [
                      { id: 0, value: complete, label: "Complete" },
                      { id: 1, value: inProg, label: "In Progress" },
                      { id: 2, value: notStarted, label: "Not Started" },
                    ],
                    innerRadius: 30,
                    paddingAngle: 2,
                    cornerRadius: 5,
                  },
                ]}
                width={350}
                height={150}
              />
            </div>
            <h2>Risk Assessments</h2>
            <div className="pie3-container">
              <PieChart
                colors={["darkgreen", "gold", "firebrick"]}
                series={[
                  {
                    data: [
                      { id: 0, value: low, label: "Low" },
                      { id: 1, value: med, label: "Medium       " },
                      { id: 2, value: high, label: "High" },
                    ],
                    innerRadius: 30,
                    paddingAngle: 2,
                    cornerRadius: 5,
                  },
                ]}
                width={360}
                height={150}
              />
            </div>
          </div>
          <div className="top-item grid-item">
            <h2>Six-Month Security Risk Totals</h2>
            <div className="bar-container">
              {secRows && (
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
                aria-label="security table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "finding_id"}
                        direction={orderBy === "finding_id" ? order : "asc"}
                        onClick={() => handleSortRequest("finding_id")}
                      >
                        Finding ID
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
                        active={orderBy === "risk_score"}
                        direction={orderBy === "risk_score" ? order : "asc"}
                        onClick={() => handleSortRequest("risk_score")}
                      >
                        Risk Score
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
                        active={orderBy === "open_date"}
                        direction={orderBy === "open_date" ? order : "asc"}
                        onClick={() => handleSortRequest("open_date")}
                      >
                        Open Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "closed_date"}
                        direction={orderBy === "closed_date" ? order : "asc"}
                        onClick={() => handleSortRequest("closed_date")}
                      >
                        Close Date
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {secRows &&
                    sortedRows.map((row) => (
                      <TableRow
                        hover
                        key={row.finding_id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.finding_id}
                        </TableCell>
                        <TableCell align="left">{row.description}</TableCell>
                        <TableCell align="left">
                          {row.application_name}
                        </TableCell>
                        <TableCell align="left">
                          {row.assignment_group}
                        </TableCell>
                        <TableCell align="left">{row.risk_score}</TableCell>
                        <TableCell align="left">{row.status}</TableCell>
                        <TableCell align="left">
                          {row.create_date.slice(0, -13)}
                        </TableCell>
                        <TableCell align="left">
                          {row.closed_date ? row.closed_date.slice(0, -13) : ""}
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

export default Security;

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

// Function that counts the status totals and returns them in an object with counts.
function countSecurityStatus (arr) {
  let notStartedCount = 0, completeCount = 0, inProgCount = 0;

  // Iterate through each object in the array
  for (const obj of arr) {
    // Check status text and increment respective counter
    switch (obj['status']) {
      case 'Not Started':
        notStartedCount++;
        break;
      case 'Work in Progress':
        inProgCount++;
        break;
      case 'Complete':
        completeCount++
        break;
    }
  }

  // Store the counts in an object
  const counts = {
    NotStarted: notStartedCount,
    InProg: inProgCount,
    Complete: completeCount,
  }

  // Return object of counts
  return counts;

}

// Function to count the risk scores and convert them into low/med/high for graphical display
function getRiskAssessmentValues (arr) {
  let low = 0, med = 0, high = 0;

  for (const obj of arr) {
    if (obj['risk_score'] === 1) {
      low++;
    }
    if (obj['risk_score'] === 2 || obj['risk_score'] === 3 || obj['risk_score'] === 4) {
      med++;
    }
    if (obj['risk_score'] === 5) {
      high++;
    }
  }

  // Store the risk values
  const riskValues = {
    Low: low,
    Med: med,
    High: high,
  }

  // Return object of risk values
  return riskValues;
}

// Gets the previous six month counts for open and closed security findings
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

  // For each security finding
  for (const obj of arr) {
    // Get the month of the current security finding
    let month = getMonthAbbreviation(obj['create_date']);

    for (let i = 0; i < dataset.length; i++) {
      // Find the month in the dataset variable
      if (dataset[i].month === month) {
        // If it's null, increment the open count
        if (obj['closed_date'] === null) {
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