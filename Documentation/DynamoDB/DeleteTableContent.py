# used to delete to content of a given table, name must be edited based on table
import boto3

# Set the endpoint URL for DynamoDB Local
dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')

# Replace 'YourTableName' with your actual table name
table_name = 'ApplicationTable'
table = dynamodb.Table(table_name)

# Scan the table and delete each item
response = table.scan()
for item in response.get('Items', []):
    table.delete_item(
        Key={
            'application_id': item['application_id']
            # Replace 'YourPrimaryKey' with your actual primary key attribute
        }
    )

print(f"All items deleted from {table_name} table.")
