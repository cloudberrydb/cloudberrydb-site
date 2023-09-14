import os
import re

# 获取所有 .html.md 文件名，并去除 .md 后缀，只保留 .html
def get_html_files_with_html_suffix(directory_path):
    filenames = os.listdir(directory_path)
    return [filename.replace('.md', '') for filename in filenames if filename.endswith('.html.md')]

def modify_links_in_file(file_path, ref_files):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 使用正则表达式找到所有的引用格式 [xxx](ref_file.html)，并根据条件进行替换
    modified_content = re.sub(
        r'\[([^\]]+)\]\(([^)]+)\)',  # 正则表达式
        lambda m: m.group(1) if m.group(2).endswith('.html') and m.group(2) not in ref_files and not m.group(2).startswith('https') else m.group(0),  # 替换逻辑
        content
    )

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(modified_content)

def process_directory(directory_path, ref_files):
    filenames = os.listdir(directory_path)
    for filename in filenames:
        if filename.endswith('.md'):
            modify_links_in_file(os.path.join(directory_path, filename), ref_files)
            print(f'Processed {filename}')

if __name__ == '__main__':
    ref_directory = "/Users/hashdata/Documents/GitHub/gpdb/gpdb-doc/markdown/ref_guide/sql_commands"
    main_directory = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/sql-statements"

    ref_files = get_html_files_with_html_suffix(ref_directory)
    process_directory(main_directory, ref_files)
