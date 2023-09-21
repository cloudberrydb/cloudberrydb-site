import os

folder_path = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/db-utilities"

# 遍历文件夹中的所有文件
for file_name in os.listdir(folder_path):
    # 检查文件是否为 markdown 文件
    if file_name.endswith('.md'):
        # 创建新文件名
        new_file_name = "db-util-" + file_name
        # 重命名文件
        os.rename(os.path.join(folder_path, file_name), os.path.join(folder_path, new_file_name))
