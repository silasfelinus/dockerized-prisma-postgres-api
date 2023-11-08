import json
import glob
import os

def convert_tsv_to_json(tsv_filename, json_filename):
    with open(tsv_filename, 'r') as infile, open(json_filename, 'w', encoding='utf-8') as outfile:
        headers = infile.readline().strip().split('\t')
        
        # Initialize a list to store the json objects
        json_list = []
        line_count = 0

        for line in infile:
            line_count += 1
            data = line.strip().split('\t')
            
            # If the number of data fields doesn't match headers, print a warning
            if len(data) != len(headers):
                print(f"Warning: Line {line_count} in {tsv_filename} has a different number of fields than the headers.")
                continue  # Skip this line or handle error as needed
            
            json_list.append(dict(zip(headers, data)))

        # Write the list of JSON objects to the output file
        json.dump(json_list, outfile, ensure_ascii=False, indent=4)

    print(f"Converted {tsv_filename} to JSON and saved as '{json_filename}'")

# Convert all TSV files in the current directory to JSON
for tsv_file in glob.glob('*.tsv'):
    json_file = f"{os.path.splitext(tsv_file)[0]}.json"
    convert_tsv_to_json(tsv_file, json_file)