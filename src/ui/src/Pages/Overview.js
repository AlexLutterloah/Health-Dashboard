import React, { useState, useEffect } from "react";
import "./Overview.css";
import { Link } from "react-router-dom";
import MainHeader from "../Components/MainHeader";
import axios from "axios";

// MUI components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import { PieChart } from "@mui/x-charts/PieChart";

const Overview = (props) => {
  // Get data passed in as a prop
  const rows = props.rows || [];
  // State variable to store the API data
  const [exData, setExData] = useState();
  const [incData, setIncData] = useState();
  const [secData, setSecData] = useState();

  // API call to get exception table data
  useEffect(() => {
    axios.get(`http://localhost:8080/api/exception`).then((res) => {
      setExData(res.data);
    });
  }, []);

  // API call to get incident table data
  useEffect(() => {
    axios.get(`http://localhost:8080/api/incident`).then((res) => {
      setIncData(res.data);
    });
  }, []);

  // API call to get security table data
  useEffect(() => {
    axios.get(`http://localhost:8080/api/security`).then((res) => {
      setSecData(res.data);
    });
  }, []);

  // Used for table sorting and searching
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle the sort request when header is clicked
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Function to handle searching when text changes in the search input
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Stores the sorted and searched table
  const filteredAndSortedRows = rows
    .filter(row =>
      Object.values(row).some(value =>
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (orderBy === '') return 0;
      const comparison = a[orderBy] > b[orderBy] ? 1 : -1;
      return order === 'asc' ? comparison : -comparison;
    });


  // Variables used for the security findings counts
  let allCounts, complete, inProg, notStarted;

  // Variables used in risk score counts
  let risks, riskCounts, low, mod, high;

  // Verify API calls stored data in state variables
  if (secData) {
    // An array of security status counts used for the Total Security findings graph
    allCounts = countSecurityStatus(secData);
    complete = allCounts.Complete;
    inProg = allCounts.InProg;
    notStarted = allCounts.NotStarted;

    // An array of ASV IDs and their associated risk scores in text format (low/moderate/high)
    risks = getRiskScores(rows, secData);

    // An array of risk counts used for the Overall Risk Assessment graph
    riskCounts = getRiskCounts(risks);
    low = riskCounts.Low;
    mod = riskCounts.Moderate;
    high = riskCounts.High;
  }

  // Variables used in the overall health score counts
  let healthScores, healthCounts, onTrack, deadline, needsAttention;

  // Verify API calls stored data in state variables
  if (secData && incData && exData) {
    // An array of ASV IDs and their associated overall health scores to be used in the Overall Health Score graph.
    healthScores = getHealthScores(rows, exData, incData, secData);

    // Get the total counts of each type of health score to be used in Overall Health Status graph
    healthCounts = getHealthCounts(healthScores);
    onTrack = healthCounts.OnTrack;
    deadline = healthCounts.Deadline;
    needsAttention = healthCounts.NeedsAttention;
  }

  return (
    <div>
      <MainHeader titleText={"Overview"} />
      <div className="overview-container">
        <div className="grid-wrapper">
          <div className="top-wrapper">
            <div className="top-item grid-item">
              <h2 className="section-title">Overall Health Status</h2>
              <div className="piechart-container">
                <PieChart
                  colors={["darkgreen", "gold", "firebrick"]}
                  series={[
                    {
                      data: [
                        { id: 0, value: onTrack, label: "On Track" },
                        {
                          id: 1,
                          value: deadline,
                          label: "Deadline Approaching",
                        },
                        {
                          id: 2,
                          value: needsAttention,
                          label: "Needs Attention",
                        },
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
              <h2>Total Security Findings</h2>
              <div className="piechart2-container">
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
              <h2>Overall Risk Assessment</h2>
              <div className="piechart3-container">
                <PieChart
                  colors={["darkgreen", "gold", "firebrick"]}
                  series={[
                    {
                      data: [
                        { id: 0, value: low, label: "Low" },
                        { id: 1, value: mod, label: "Moderate    " },
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
          </div>
          <div className="grid-item">
            <div className="search">
              <TextField
                size="small"
                id="outlined-basic"
                label="Search"
                variant="outlined"
                type="search"
                onChange={handleSearchInputChange}
                color="primary"
                autoFocus
                sx={{ minWidth: 700 }}
              />
            </div>
            <TableContainer className="table-container" component={Paper}>
              <Table stickyHeader sx={{ minWidth: 450 }} aria-label="asv table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "asv_id"}
                        direction={orderBy === "asv_id" ? order : "asc"}
                        onClick={() => handleSortRequest("asv_id")}
                      >
                        ASV ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                      {" "}
                      <TableSortLabel
                        active={orderBy === "asv_name"}
                        direction={orderBy === "asv_name" ? order : "asc"}
                        onClick={() => handleSortRequest("asv_name")}
                      >
                        ASV Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "created_date"}
                        direction={orderBy === "created_date" ? order : "asc"}
                        onClick={() => handleSortRequest("created_date")}
                      >
                        Created Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">
                      <TableSortLabel
                        active={orderBy === "employee_id"}
                        direction={orderBy === "employee_id" ? order : "asc"}
                        onClick={() => handleSortRequest("employee_id")}
                      >
                        Employee ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">Risk</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    ? filteredAndSortedRows.map((row) => (
                        <TableRow
                          hover
                          key={row.asv_id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.asv_id}
                          </TableCell>
                          <TableCell align="left">{row.asv_name}</TableCell>
                          <TableCell align="left">
                            {row.created_date.slice(0, -13)}
                          </TableCell>
                          <TableCell align="left">{row.description}</TableCell>
                          <TableCell align="left">{row.employee_id}</TableCell>
                          <TableCell align="left">
                            {risks &&
                              risks.find((risk) => risk.id === row.asv_id)
                                .score}
                          </TableCell>
                          <TableCell align="left">
                            {healthScores &&
                              healthScores.find(
                                (healthScore) => healthScore.id === row.asv_id
                              ).score}
                          </TableCell>
                          <TableCell align="center">
                            <Link to={"/" + row.asv_id + "/exceptions"}>
                              <Button variant="contained">OPEN</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

// ****************** HELPER FUNCTIONS ****************** //

// Function that counts the status totals and returns them in an object with counts.
function countSecurityStatus(arr) {
  let notStartedCount = 0,
    completeCount = 0,
    inProgCount = 0;

  // Iterate through each object in the array
  for (const obj of arr) {
    // Check status text and increment respective counter
    switch (obj["status"]) {
      case "Not Started":
        notStartedCount++;
        break;
      case "Work in Progress":
        inProgCount++;
        break;
      case "Complete":
        completeCount++;
        break;
      default:
        console.log("ERROR, INCORRECT VALUE STORED IN DB");
    }
  }

  // Store the counts in an object
  const counts = {
    NotStarted: notStartedCount,
    InProg: inProgCount,
    Complete: completeCount,
  };

  // Return object of counts
  return counts;
}

// Function that takes an ASV ID and returns the risk score text based on security finding risk score values.
function getRiskScoreByASV(id, arr) {
  let totalRisk = 0,
    findingCount = 0,
    avgRisk = 0;

  for (const obj of arr) {
    if (obj["asv_id"] === id) {
      findingCount++;
      totalRisk += obj["risk_score"];
    }
  }

  avgRisk = totalRisk / findingCount;

  if (avgRisk < 2.5) {
    return "Low";
  }
  if (avgRisk >= 2.5 && avgRisk <= 3.1) {
    return "Moderate";
  }
  if (avgRisk > 3.1) {
    return "High";
  }
}

// Returns an array of asv IDs and their associated risk scores.
function getRiskScores(asvData, secArr) {
  const data = [];

  for (const obj of asvData) {
    let item = {
      id: obj["asv_id"],
      score: getRiskScoreByASV(obj["asv_id"], secArr),
    };

    data.push(item);
  }

  return data;
}

// Returns an array of total counts for risks.
function getRiskCounts(arr) {
  let low = 0,
    mod = 0,
    high = 0;

  // Iterate through each object in the array
  for (const obj of arr) {
    // Check status text and increment respective counter
    switch (obj["score"]) {
      case "Low":
        low++;
        break;
      case "Moderate":
        mod++;
        break;
      case "High":
        high++;
        break;
      default:
        console.log("ERROR, INCORRECT VALUE STORED IN DB");
    }
  }

  // Store the totals in an object
  const totals = {
    Low: low,
    Moderate: mod,
    High: high,
  };

  // Return object of totals
  return totals;
}

// Returns an array of health scores for each ASV
function getHealthScores(asvData, exData, incData, secData) {
  const data = [];

  for (const obj of asvData) {
    let asv_id,
      scoreText,
      avgScore = 0,
      exScore = 0,
      incScore = 0,
      secScore = 0;

    asv_id = obj["asv_id"];

    exScore = getExceptionHealthScore(asv_id, exData);
    incScore = getIncidentHealthScore(asv_id, incData);
    secScore = getSecurityHealthScore(asv_id, secData);

    // Add up each of the scores and divide by 3 to take the average
    avgScore = (exScore + incScore + secScore) / 3;

    // Evaluate the average score, and set scoreText equal to a text value
    if (avgScore < 3) {
      scoreText = "On Track";
    } else if (avgScore >= 3 && avgScore <= 3.2) {
      scoreText = "Deadline Approaching";
    } else if (avgScore > 3.2) {
      scoreText = "Needs Attention";
    }

    // Store the ASV and it's score in the array
    let item = {
      id: asv_id,
      score: scoreText,
    };

    data.push(item);
  }

  return data;
}

// Get exceptions overall health score
function getExceptionHealthScore(id, arr) {
  let totalScore = 0,
    avgScore = 0,
    count = 0;

  // Iterate through array to check each record
  for (const obj of arr) {
    if (obj["asv_id"] === id) {
      count++;
      totalScore += obj["risk_score"];
    }
  }

  // Get the average of all scores
  avgScore = totalScore / count;

  return avgScore;
}

// Get incidents overall health score
function getIncidentHealthScore(id, arr) {
  let totalScore = 0,
    avgScore = 0,
    count = 0;

  // Iterate through array to check each record
  for (const obj of arr) {
    if (obj["asv_id"] === id) {
      count++;
      totalScore += obj["priority"];
    }
  }

  // Get the average of all scores
  avgScore = totalScore / count;

  return avgScore;
}

// Get security overall health score
function getSecurityHealthScore(id, arr) {
  let totalScore = 0,
    avgScore = 0,
    count = 0;

  // Iterate through array to check each record
  for (const obj of arr) {
    if (obj["asv_id"] === id) {
      count++;
      totalScore += obj["risk_score"];
    }
  }

  // Get the average of all scores
  avgScore = totalScore / count;

  return avgScore;
}

// Get the total health counts of all ASVs and return an array of objects with the data
function getHealthCounts(arr) {
  let onTrack = 0,
    deadline = 0,
    needsAttention = 0;

  // Iterate through each object in the array
  for (const obj of arr) {
    // Check status text and increment respective counter
    switch (obj["score"]) {
      case "On Track":
        onTrack++;
        break;
      case "Deadline Approaching":
        deadline++;
        break;
      case "Needs Attention":
        needsAttention++;
        break;
      default:
        console.log("ERROR, INCORRECT VALUE STORED IN DB");
    }
  }

  // Store the totals in an object
  const totals = {
    OnTrack: onTrack,
    Deadline: deadline,
    NeedsAttention: needsAttention,
  };

  // Return object of totals
  return totals;
}
