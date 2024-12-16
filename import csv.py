import json

def json_to_sql(json_file, table_name):
    """
    Converts a JSON file into SQL INSERT statements for a specified table.
    
    :param json_file: output.json
    :param table_name: classification 
    """
    with open(json_file, 'r') as file:
        data = json.load(file)
    
    sql_statements = []
    
    for record in data:
        # Extract column names and values
        columns = ', '.join(record.keys())
        
        # Format values appropriately for SQL
        values = ', '.join(
            f"'{value.replace('\'', '\\\'')}'" if isinstance(value, str) else str(value) 
            for value in record.values()
        )
        
        # Generate the SQL INSERT statement
        sql_statements.append(f"INSERT INTO {table_name} ({columns}) VALUES ({values});")
    
    # Write the SQL statements to a file
    with open('classification.sql', 'w') as sql_file:
        sql_file.write('\n'.join(sql_statements))
    
    print("SQL file created: classification.sql")

# Example usage:
json_to_sql('output.json', 'classification')
