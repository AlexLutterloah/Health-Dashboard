import pandas as pd
import numpy as np

# Generate random data
np.random.seed(0)

# Number of data points
n = 1000

# Generate incident IDs
incident_ids = ['INC' + str(i).zfill(4) for i in range(1, n + 1)]

# Generate random duration of days open (between 1 and 250 days)
days_open = np.random.randint(1, 251, n)

# Generate random application names
applications = ['App' + str(np.random.randint(1, 6)) for _ in range(n)]

# Generate random assignment groups
assignment_groups = np.random.choice(['Security Team', 'IT Operations', 'Support Team'], n)

# Generate random priorities (values from 1 to 10)
priorities = np.random.randint(1, 11, n)

# Generate curr states 
curr_states = np.random.choice(['Open', 'Closed', 'In Progress'], n)

# Initialize state column
states = [''] * n

# Set states based on conditions
for i in range(n):
    if curr_states[i] == 'Closed':
        states[i] = 'Closed'
    elif curr_states[i] == 'In Progress' and priorities[i] > 5:
        states[i] = 'Closed'
    elif curr_states[i] == 'In Progress' and 3 <= priorities[i] <= 5 and assignment_groups[i] in ['Security Team, IT Operations']:
        states[i] = 'Closed'
    elif curr_states[i] == 'In Progress' and 3 <= priorities[i] <= 5 and assignment_groups[i] in ['Support Team']:
        states[i] = 'Closed'
    elif curr_states[i] == 'In Progress' and priorities[i] < 3:
        states[i] = 'In Progress'
    elif curr_states[i] == 'Open' and priorities[i] > 7 and assignment_groups[i] in ['Security Team, IT Operations']:
        states[i] = 'Closed'
    elif curr_states[i] == 'Open' and priorities[i] > 5:
        states[i] = 'In Progress'
    else:
        states[i] = 'Open'





# Create DataFrame
data = pd.DataFrame({
    'incident_id': incident_ids,
    'days_open': days_open,
    'application_name': applications,
    'assignment_group': assignment_groups,
    'priority': priorities,
    'current_state': curr_states,
    'state_after_six_months': states  
})

# Save data to CSV file
data.to_csv('incident_data.csv', index=False)

print("Data generation and saving completed.")
