import pandas as pd
import re

# Load the CSV file containing the extracted keywords
input_file = "extracted_keywords.csv"  # Replace with your actual file name
output_file = "cleaned_keywords.txt"   # Replace with your desired output file name

# Read the CSV file
df = pd.read_csv(input_file)

# Function to clean and format the extracted keywords
def clean_keywords(keyword_list):
    try:
        # Convert string to list
        keywords = eval(keyword_list)
        # Remove unwanted tokens or fragments
        cleaned = [kw.replace('â–', '').strip() for kw in keywords if len(kw) > 1 and re.match(r'^[a-zA-ZÀ-ÿ]+$', kw)]
        return ', '.join(cleaned)  # Return as a comma-separated string
    except:
        return ""  # Return empty if there's an issue with the input

# Apply the cleaning function to the 'extracted_keywords' column
df['cleaned_keywords'] = df['extracted_keywords'].apply(clean_keywords)

# Extract only the cleaned keywords
cleaned_keywords = df['cleaned_keywords'].tolist()

# Write the cleaned keywords to a new text file
with open(output_file, "w", encoding="utf-8") as f:
    for line in cleaned_keywords:
        f.write(line + "\n")

print(f"Cleaned keywords have been saved to {output_file}")
