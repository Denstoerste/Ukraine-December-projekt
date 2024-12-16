import pandas as pd
import re

# Load the CSV file
df = pd.read_csv('extracted_keywords.csv')

# Function to clean keywords
def clean_keywords(keyword_list):
    # Convert string to list (if stored as a string)
    keywords = eval(keyword_list)
    # Remove unwanted tokens or fragments
    cleaned = [kw.replace('â–', '').strip() for kw in keywords if len(kw) > 1 and re.match(r'^[a-zA-ZÀ-ÿ]+$', kw)]
    return ', '.join(cleaned)  # Return as a comma-separated string

# Apply cleaning to the extracted_keywords column
df['cleaned_keywords'] = df['extracted_keywords'].apply(clean_keywords)

# Save the cleaned output to a new file
df[['all_post_text', 'cleaned_keywords']].to_csv('cleaned_extracted_keywords.csv', index=False)

print("Cleaned keywords saved to 'cleaned_extracted_keywords.csv'")
