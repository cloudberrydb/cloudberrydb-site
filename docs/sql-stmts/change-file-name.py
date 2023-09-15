import os

folder_path = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/sql-statements"

for file_name in os.listdir(folder_path):
    if not file_name.endswith('.md'):
        continue

    file_path = os.path.join(folder_path, file_name)

    with open(file_path, 'r') as file:
        lines = file.readlines()

    title = lines[0].strip().replace('# ', '')
    
    # Insert metadata lines at the beginning
    lines.insert(0, '---\n')
    lines.insert(1, f'title: {title}\n')
    lines.insert(2, '---\n\n')  # We add an additional newline for spacing

    with open(file_path, 'w') as file:
        file.writelines(lines)
