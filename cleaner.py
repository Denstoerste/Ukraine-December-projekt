import pandas as pd
import re
import os

def preprocess_text(text):
    """
    Cleans a single post by removing unwanted special characters
    while keeping characters that belong in regular sentences.
    """
    text = re.sub(r'[^a-zA-Z0-9\s.,!?\'"-]', ' ', str(text))  # Retain normal sentence characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra whitespace
    return text

def process_excel(input_file, output_folder, chunk_size=5000):
    """
    Processes an Excel file to clean and split into smaller CSV files.

    Args:
    - input_file (str): Path to the input Excel file.
    - output_folder (str): Directory to save the processed files.
    - chunk_size (int): Number of posts per output file.
    """
    # Read the Excel file into a DataFrame
    df = pd.read_excel(input_file, header=0)  # Assuming the file has a header
    column_name = df.columns[0]  # Use the first column as text data
    print(f"Processing column: {column_name}")

    # Clean each post
    df['cleaned_text'] = df[column_name].apply(preprocess_text)

    # Ensure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Split into chunks and save each chunk as a separate CSV file
    total_rows = len(df)
    for i in range(0, total_rows, chunk_size):
        chunk = df.iloc[i:i + chunk_size]
        output_file = os.path.join(output_folder, f'cleaned_posts_part_{i // chunk_size + 1}.csv')
        chunk[['cleaned_text']].to_csv(output_file, index=False, header=False)
        print(f"Saved: {output_file}")

# Example usage
if __name__ == "__main__":
    input_excel = "all_post_text2.xlsx"  # Replace with your Excel file path
    output_directory = "processed_posts"  # Replace with your desired output folder
    posts_per_file = 5000  # Adjust the chunk size as needed

    process_excel(input_excel, output_directory, posts_per_file)
