import os

dir_path = "/Users/hashdata/Documents/GitHub/upstream/cloudberrydb-site/docs/sql-stmts"
content_to_insert = """
> [!WARNING]
> The document page you are reading is not ready yet. It might contain inaccurate or incorrect content. It is not recommended to use this document for serious reference.
"""

for filename in os.listdir(dir_path):
    if filename.endswith(".md"):
        file_path = os.path.join(dir_path, filename)
        
        with open(file_path, 'r') as file:
            file_contents = file.readlines()

        # 将内容插入到第 6 行
        file_contents.insert(5, content_to_insert)

        with open(file_path, 'w') as file:
            file.writelines(file_contents)
