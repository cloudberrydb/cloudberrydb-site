import os

folder_path = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/system-utilities"

# Step 1: Get all markdown filenames in a list
markdown_filenames = [f for f in os.listdir(folder_path) if f.endswith('.md')]

# Step 2: Traverse each markdown file and check if there is a mention of any filename in the list
for file_name in os.listdir(folder_path):
    if not file_name.endswith('.md'):
        continue

    file_path = os.path.join(folder_path, file_name)
    
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Check if any filename from the list is mentioned in the current file
    # If yes, replace it with "db-util-" + filename
    for markdown_filename in markdown_filenames:
        if markdown_filename in content:
            content = content.replace(markdown_filename, "db-util-" + markdown_filename)
    
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)
