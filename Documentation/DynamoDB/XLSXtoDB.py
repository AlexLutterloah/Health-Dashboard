# used to read multiple excel files from a folder and insert them into associated tables
# schema must be created and data types established 

import os
import boto3
import json
import pandas as pd

def insert_data_into_dynamodb(file_path, table_name):
    # Read data from Excel to DataFrame
    excel_data = pd.read_excel(file_path)

    # Convert DataFrame to JSON
    json_data = json.loads(excel_data.to_json(orient='records', date_format='iso'))

    # Insert data into DynamoDB
    for item in json_data:
        table.put_item(Item=item)

    print(f"Data from {file_path} inserted into DynamoDB table {table_name}")

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')

# Iterate through Excel files in the folder
# make sure path points to folder that holds the excel tables
folder_path = os.getcwd()

for file_name in os.listdir(folder_path):
    if file_name.endswith('.xlsx'):
        # Construct full file path
        file_path = os.path.join(folder_path, file_name)

        # Extract table name from the file name (excluding extension)
        table_name = os.path.splitext(file_name)[0]

        # Access or create DynamoDB table
        table = dynamodb.Table(table_name)

        # Insert data into DynamoDB
       
        insert_data_into_dynamodb(file_path, table_name)

print("\nAll Excel files inserted into DynamoDB tables.")
