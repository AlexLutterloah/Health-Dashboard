const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// CORS is a middleware that allows us to communicate with local client on a different port.
app.use(cors());

// Define AWS configuration
const awsConfig = {
   "region": "localhost",
   "endpoint": "http://localhost:8000",
   "accessKeyId": AWS.config.credentials.accessKeyId,
   "secretAccessKey": AWS.config.credentials.secretAccessKey
};

// Update AWS configuration to connect to DynamoDB
AWS.config.update(awsConfig);

// Create DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// API: Get all ASV table data
app.get('/api/asv', (req, res) => {
  // Get from DB
  docClient.scan({ TableName: "ASV" }, function (err, data) {
    if (err) {
      res.status(500).json({ error: "Error fetching ASV Table", code: err.code });
    } else {
      // Return the ASV table data
      res.json(data.Items);
    }
  });
});

// API: Get all security table data
app.get('/api/security', (req, res) => {
  // Get from DB
  docClient.scan({ TableName: "Security" }, function (err, data) {
    if (err) {
      res.status(500).json({ error: "Error fetching Security Table", code: err.code });
    } else {
      // Return the ASV table data
      res.json(data.Items);
    }
  });
});

// API: Get all exception table data
app.get('/api/exception', (req, res) => {
  // Get from DB
  docClient.scan({ TableName: "Exception" }, function (err, data) {
    if (err) {
      res.status(500).json({ error: "Error fetching Exception Table", code: err.code });
    } else {
      // Return the ASV table data
      res.json(data.Items);
    }
  });
});

// API: Get all Incident table data
app.get('/api/incident', (req, res) => {
  // Get from DB
  docClient.scan({ TableName: "Incident" }, function (err, data) {
    if (err) {
      res.status(500).json({ error: "Error fetching Incident Table", code: err.code });
    } else {
      // Return the ASV table data
      res.json(data.Items);
    }
  });
});

// API: Get all Exceptions for a specified ASV
app.get('/api/asv/:asv_id/exceptions', (req, res) => {
  // Get the ASV id from route parameters
  const ASVID = parseInt(req.params.asv_id);

  // Define query parameters
  var params = {
    TableName: 'Exception',
    FilterExpression : "asv_id = :asvID",
    ExpressionAttributeValues: {':asvID': ASVID }
  };

  // Send query to DB and return results
  docClient.scan(params, function (err, data) {
    if (err) {
      res.status(500).json({ error: 'Error fetching Exception Table', code: err.code });
    } else {
      // Return the ASV table data
      res.json(data.Items);
    }
  });
});

// API: Get all applications for a specified ASV
app.get('/api/asv/:asv_id/applications', (req, res) => {
  // Get the ASV id from route parameters
  const ASVID = parseInt(req.params.asv_id);
  
  // Define query parameters
  var params = {
    TableName: 'Application',
    FilterExpression : "asv_id = :asvID",
    ExpressionAttributeValues: {':asvID': ASVID }
  };

  // Send query to DB and return results
  docClient.scan(params, function (err, data) {
    if (err) {
      res.status(500).json({ error: 'Error fetching Application Table', code: err.code });
    } else {
      // Return the ASV table data
      res.json(data.Items);
    }
  });
});

// API: Get all incidents for a specified ASV
app.get('/api/asv/:asv_id/incidents', (req, res) => {
  // Get the ASV id from route parameters
  const ASVID = parseInt(req.params.asv_id);
  
  // Define query parameters
  var params = {
    TableName: 'Incident',
    FilterExpression : "asv_id = :asvID",
    ExpressionAttributeValues: {':asvID': ASVID }
  };

  // Send query to DB and return results
  docClient.scan(params, function (err, data) {
    if (err) {
      res.status(500).json({ error: 'Error fetching Incident Table', code: err.code });
    } else {
      // Return the ASV table data
      res.json(data.Items);
    }
  });
});

// API: Get all security findings for a specified ASV
app.get('/api/asv/:asv_id/security', (req, res) => {
  // Get the ASV id from route parameters
  const ASVID = parseInt(req.params.asv_id);
  
  // Define query parameters
  var params = {
    TableName: 'Security',
    FilterExpression : "asv_id = :asvID",
    ExpressionAttributeValues: {':asvID': ASVID }
  };

  // Send query to DB and return results
  docClient.scan(params, function (err, data) {
    if (err) {
      res.status(500).json({ error: 'Error fetching Security Table', code: err.code });
    } else {
      // Return the ASV table data
      res.json(data.Items);
    }
  });
});

// API: Get first name of user 
app.get('/api/firstname', (req, res) => {
  // Get the ASV id from route parameters
  const ASVID = parseInt(req.params.asv_id);
  
  // Define query parameters
  var params = {
    TableName: 'Users',
    FilterExpression : "email = :email",
    ExpressionAttributeValues: {':email': email }
  };

  // Send query to DB and return results
  docClient.scan(params, function (err, data) {
    if (err) {
      res.status(500).json({ error: 'Error fetching user row', code: err.code });
    } else {
      // Return the user data
      res.json(data.Items);
    }
  });
});


app.post('/api/create-account', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if all required fields are present
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Example: Create a new user object
  const newUser = {
    firstName,
    lastName,
    email,
    password,
    createdAt: new Date(),
  };

  // Add the new user to your database (replace this with your actual database logic)
  // For example, you can use the DocumentClient to put item into DynamoDB
  const params = {
    TableName: 'Users', 
    Item: newUser  // Include newUser as the value for the 'Item' key
  };

  docClient.put(params, (err, data) => {
    if (err) {
      console.error('Error creating user account:', err);
      res.status(500).json({ error: 'Error creating user account' });
    } else {
      console.log('User account created successfully:', data);
      res.status(201).json({ message: 'User account created successfully', user: newUser });
    }
  });
});


app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  var params = {
    TableName: "Users",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email },
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      console.error("Error retrieving user data:", err);
      res.status(500).json({ error: "Error retrieving user data" });
    } else {
      console.log("Data received:", data);

      // Check if data.Items is an array and not empty
      if (Array.isArray(data.Items) && data.Items.length > 0) {
        const user = data.Items[0]; // Assuming the first item contains user data
        console.log("User:", user);

        // Check if user object has the password property
        if (user.hasOwnProperty("password")) {
          if (user.password === password) {
            console.log("Login successful");
            res.status(200).json({ message: "Login successful", user: user });
          } else {
            console.log("Invalid email or password");
            res.status(401).json({ error: "Invalid email or password" });
          }
        } else {
          console.log("Password property not found in user object");
          res
            .status(500)
            .json({ error: "Password property not found in user object" });
        }
      } else {
        console.log("User not found or empty data");
        res.status(404).json({ error: "User not found or empty data" });
      }
    }
  });
});

// API: Get first and last name of user 
app.get('/api/user/:email', (req, res) => {
  // Get the email from route parameters
  const email = req.params.email;
  
  // Define query parameters
  var params = {
    TableName: 'Users',
    FilterExpression : "email = :email",
    ExpressionAttributeValues: {':email': email }
  };

  // Send query to DB and return results
  docClient.scan(params, function (err, data) {
    if (err) {
      res.status(500).json({ error: 'Error fetching user data', code: err.code });
    } else {
      // Check if data.Items is an array and not empty
      if (Array.isArray(data.Items) && data.Items.length > 0) {
        const user = data.Items[0]; // Assuming the first item contains user data
        const { firstName, lastName } = user; // Extract first name and last name
        
        // Return the first name and last name of the user
        res.json({ firstName, lastName });
      } else {
        res.status(404).json({ error: 'User not found or empty data' });
      }
    }
  });
});



// Run server on specified port
app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
});