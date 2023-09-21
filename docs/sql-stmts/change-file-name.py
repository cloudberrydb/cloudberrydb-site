import os

# 指定目录路径
directory_path = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/db-utilities"

# 获取目录的名称
parent_dir_name = os.path.basename(directory_path)

# 获取目录下的所有文件并存入列表中
file_list = [os.path.join(parent_dir_name, f[:-3]) for f in os.listdir(directory_path) if f.endswith('.md')]

# 按照指定格式输出文件名列表
print("[")
for filename in file_list:
    print(f"  '{filename}',")
print("]")
