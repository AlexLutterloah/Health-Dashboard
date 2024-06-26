# *CS-24-324-Health dashboard for a Line of Business*
## *Capital One*
## *Problem statement - “As a platform stakeholder, how can I quickly determine what is not well managed, so that I can drive action for remediation?”*

Acceptance Criteria - Create a well-managed dashboard to display the health of each application under Accountable Executive (AE). The dashboard should fetch the most recent data when an AE logs in to the system via SSO.The application should have different sections to display the following - 

1. List all applications with overall health using graphs. Graphs should display “Overall exception status”, “Security risks”, “security assessment”, “exceptions”, “incidents”

2. The security risk for each application (Low, Medium, High, Critical)  - AE should be able to click on each and navigate to a detail page to see more information on each risk item 
            
            Graphical representation of open incidents by severity
                
            Graphical representation of  Monthly total
                
            Integrate with CVE to get an assessment of open-risk items
                
            Graphical representation of  at least 6 months of data

3. Incident status for each application (Open, closed, resolution) - AE should be able to click on each and navigate to the detail page to see more information on each incident and status

            Graphical representation of open incidents by severity
            
            Graphical representation of  Monthly total
            
            Graphical representation of  at least 6 months of data
            
            Build a machine learning algorithm to predict 6 months of data for future 

4. Security assessment - Should provide a graphical and tabular view of security assessment for each application

5. List of exceptions for each application (Open/ approved/pending/expiring soon)

## Project Team
- *Jit Ray*  - *Capital One* - Mentor/Technical Advisor
- *Satinder Gill* - *Biomedical Engineering* - Faculty Advisor Fall 2023
- *Aaron Lee* - *Computer Science* - Faculty Advisor Spring 2024
- *Alex Lutterloah* - *Computer Science* - Student Team Member
- *Harita Agarwal* - *Computer Science* - Student Team Member
- *Adnan Dhanaliwala* - *Computer Science* - Student Team Member
- *Hassan Othman* - *Computer Science* - Student Team Member

## Prototype

[FIGMA - Prototype V1](https://www.figma.com/proto/iSlqnrrLy5ki1eWW7l8ir9/FINAL-MOCK-UP---Health-Dashboard?node-id=2-7&starting-point-node-id=2%3A7&mode=design&t=2FGDSO9tEwu6b4GM-1)

[FIGMA - Prototype V2](https://www.figma.com/proto/iSlqnrrLy5ki1eWW7l8ir9/FINAL-MOCK-UP---Health-Dashboard?type=design&node-id=66-65&t=vZcjAiQKd7RsG63K-1&scaling=min-zoom&page-id=66%3A64&mode=design)

## Instructions to run application
- Installation Requirements: Node JS, DynamoDB/NoSQL Workbench.
- First, set up the local dynamoDB instance. [You can follow Amazon's documentation here.](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html) Configure AWS credentials, open NoSQL Workbench and import the Capstone24.json as the database schema which is found in the DyanmoDB directory. There are additional instructions in the DynamoDB directory to set up and populate the database using the python script (XLSXtoDB.py) to populate the excel data into your local database.
- Once your local DynamoDB instance is running, navigate to the *ui* directory and run an npm install, and in a separate terminal, do the same for the *backend* directory.
- Run *npm start* on the *backend* directory first, and then *npm start* on the *ui* directory (separate terminals).
- If everything was done correctly, the application should appear in your default browser.