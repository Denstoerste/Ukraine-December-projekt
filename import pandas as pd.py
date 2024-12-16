import pandas as pd
from transformers import pipeline

# Load CSV file
df = pd.read_csv('all_post_text.csv')

# Debug: Print columns to verify the header
print("Columns in the CSV file:", df.columns)

# Strip spaces from column names
df.columns = df.columns.str.strip()

# Check if 'all_post_text' exists
if 'all_post_text' not in df.columns:
    raise KeyError("'all_post_text' column is missing. Check the CSV file header.")

# Initialize the NER pipeline
ner_pipeline = pipeline("ner", model="xlm-roberta-base", tokenizer="xlm-roberta-base")

# Create an empty list to store keywords
all_keywords = []

# Process posts in batches of 100 rows
batch_size = 1000
for start in range(0, len(df), batch_size):
    batch = df['all_post_text'][start:start + batch_size]
    print(f"Processing rows {start} to {start + batch_size - 1}...")
    for post in batch:
        results = ner_pipeline(post)
        keywords = list(set([result['word'] for result in results]))
        all_keywords.append(keywords)

# Ensure the length of the extracted keywords matches the DataFrame length
if len(all_keywords) < len(df):
    all_keywords.extend([[]] * (len(df) - len(all_keywords)))  # Fill missing rows with empty lists

# Add extracted keywords to the DataFrame
df['extracted_keywords'] = all_keywords

# Save results to CSV
df.to_csv('extracted_keywords.csv', index=False)
print("Saved results to extracted_keywords.csv")
