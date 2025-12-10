import os
import sys

# Add backend folder to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.db import query

try:
    rows = query("SELECT NOW();")
    print("DB Connection Success:", rows)
except Exception as e:
    print("DB Connection FAILED:", e)
