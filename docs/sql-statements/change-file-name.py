import os

def rename_files_in_directory(directory_path):
    filenames = os.listdir(directory_path)
    
    for filename in filenames:
        if filename.startswith('sql-statement-') and filename.endswith('.md'):
            # 用 "sql-stmt" 替换 "sql-statement"
            new_filename = filename.replace('sql-statement-', 'sql-stmt-', 1)
            os.rename(
                os.path.join(directory_path, filename),
                os.path.join(directory_path, new_filename)
            )
            print(f"Renamed {filename} to {new_filename}")

if __name__ == "__main__":
    main_directory = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/sql-statements"
    rename_files_in_directory(main_directory)
