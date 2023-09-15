import os

# 定义处理函数
def process_file(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()

    with open(file_path, 'w') as f:
        for line in lines:
            # 检查行是否以 `** 结束且不以 **` 开头
            if line.endswith("`**\n") and not line.startswith("**`"):
                line = "**`" + line
            f.write(line)

# 设置目标文件夹
directory = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/sql-statements"  # 将此替换为你的文件夹路径

# 遍历文件夹中的所有 markdown 文件
for filename in os.listdir(directory):
    if filename.endswith(".md"):
        process_file(os.path.join(directory, filename))

