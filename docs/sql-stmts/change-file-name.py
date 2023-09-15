import os

def sentence_case(text):
    if not text:
        return text
    return text[0].upper() + text[1:].lower()

folder_path = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/sql-stmts"

for file_name in os.listdir(folder_path):
    if not file_name.endswith('.md'):
        continue

    file_path = os.path.join(folder_path, file_name)

    with open(file_path, 'r') as file:
        lines = file.readlines()

    for idx, line in enumerate(lines):
        if line.startswith(('## ', '### ', '#### ', '##### ')):
            # Split at the first space to separate '##' from the title
            parts = line.split(' ', 1)
            lines[idx] = parts[0] + ' ' + sentence_case(parts[1])

    with open(file_path, 'w') as file:
        file.writelines(lines)
