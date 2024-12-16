import collections

# Define input and output file paths
input_file = "cleaned_keywords.txt"  # Replace with your actual cleaned keywords file
output_file = "final_keywords.txt"   # File to save extracted keywords

# Load the cleaned keywords into memory
with open(input_file, "r", encoding="utf-8") as f:
    data = f.readlines()

# Flatten all keywords into a single list
all_keywords = []
for line in data:
    if line.strip():  # Ignore empty lines
        keywords = line.strip().split(", ")  # Split keywords by ", "
        all_keywords.extend(keywords)

# Count the frequency of each keyword
keyword_counts = collections.Counter(all_keywords)

# Sort keywords by frequency
sorted_keywords = keyword_counts.most_common()

# Save the top keywords to a file
top_n = 1000  # Adjust this value to include more or fewer keywords
with open(output_file, "w", encoding="utf-8") as f:
    f.write("Keyword,Count\n")  # Write a header for better readability
    for keyword, count in sorted_keywords[:top_n]:
        f.write(f"{keyword},{count}\n")

print(f"Top {top_n} keywords have been saved to {output_file}")
