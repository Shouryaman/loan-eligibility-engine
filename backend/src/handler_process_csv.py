import boto3
import csv
import io
import json
import os
import requests
from src.db import execute

s3 = boto3.client("s3")

def lambda_handler(event, context):
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = event["Records"][0]["s3"]["object"]["key"]

    obj = s3.get_object(Bucket=bucket, Key=key)
    csv_content = obj["Body"].read().decode("utf-8")

    reader = csv.DictReader(io.StringIO(csv_content))

    for row in reader:
        execute("""
            INSERT INTO users (user_id, name, email, monthly_income, credit_score, employment_status, age, raw)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_id) DO NOTHING;
        """, (
            row["user_id"],
            row["name"],
            row["email"],
            float(row["monthly_income"]),
            int(row["credit_score"]),
            row["employment_status"],
            int(row["age"]),
            json.dumps(row)
        ))

    # Trigger n8n workflow for matching
    n8n_url = os.getenv("N8N_WORKFLOW_B_URL")
    if n8n_url:
        requests.post(n8n_url, json={"file": key})

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "CSV processed successfully"})
    }
