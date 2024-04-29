import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Load the data
data = pd.read_csv('incident_data.csv')

# Encode categorical features
label_encoder = LabelEncoder()
data['application_name'] = label_encoder.fit_transform(data['application_name'])
data['assignment_group'] = label_encoder.fit_transform(data['assignment_group'])

# One-hot encode 'current_state' column
onehot_encoder = OneHotEncoder()
current_state_encoded = onehot_encoder.fit_transform(data[['current_state']])
current_state_df = pd.DataFrame(current_state_encoded.toarray(), columns=onehot_encoder.get_feature_names_out(['current_state']))
data = pd.concat([data, current_state_df], axis=1)
data.drop(['current_state'], axis=1, inplace=True)

# Split data into features and target variable
X = data[['days_open', 'application_name', 'assignment_group', 'priority'] + list(current_state_df.columns)]
y = data['state_after_six_months']

# Standardize numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train a one-vs-rest logistic regression model
model = OneVsRestClassifier(LogisticRegression(max_iter=1000))
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy:.2f}')

# Classification report
print(classification_report(y_test, y_pred))
