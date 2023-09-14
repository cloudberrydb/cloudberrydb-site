import os
import re

def remove_trailing_spaces_from_headers(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # 判断行是否是标题行且是否有尾随空格，如果是，则删除尾随空格
    modified_lines = [re.sub(r' +$', '', line) if re.match(r'^#+ .* +$', line) else line for line in lines]

    with open(file_path, 'w', encoding='utf-8') as file:
        file.writelines(modified_lines)

def process_directory(directory_path):
    # 列出给定目录下的所有文件
    filenames = os.listdir(directory_path)

    # 遍历每个 .md 文件并处理
    for filename in filenames:
        if filename.endswith('.md'):
            remove_trailing_spaces_from_headers(os.path.join(directory_path, filename))
            print(f'Processed {filename}')

# 主程序入口
if __name__ == '__main__':
    directory_path = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/sql-statements"  # 指定目录
    process_directory(directory_path)
