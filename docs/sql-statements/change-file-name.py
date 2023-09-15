import os

def add_sql_to_code_block(directory_path):
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    lines = f.readlines()

                changed = False
                for i in range(1, len(lines)):
                    # 查找空行后跟 ``` 的模式
                    if lines[i-1].strip() == "" and lines[i].strip() == "```":
                        lines[i] = "```sql\n"
                        changed = True

                if changed:
                    with open(filepath, 'w') as f:
                        f.writelines(lines)

if __name__ == "__main__":
    main_directory = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/sql-statements"
    add_sql_to_code_block(main_directory)
