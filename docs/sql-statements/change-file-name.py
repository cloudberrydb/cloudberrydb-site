import os
import re

# 获取所有 .md 文件名
def get_md_files(directory_path):
    filenames = os.listdir(directory_path)
    return [filename for filename in filenames if filename.endswith('.md')]

# 对链接文件名进行处理
def process_ref_filename(ref_filename):
    # 转换为小写、替换下划线为连字符、替换 .html 为 .md
    new_name = ref_filename.lower().replace('_', '-').replace('.html', '.md')
    # 添加前缀
    return 'sql-statement-' + new_name

# 在给定的文件内容中替换引用链接
def replace_links_in_content(content, available_files):
    # 使用正则表达式进行替换
    return re.sub(
        r'\[([^\]]+)\]\(([^)]+.html)\)',  # 正则表达式
        lambda m: f"[{m.group(1)}](/docs/sql-statements/{process_ref_filename(m.group(2))})"
        if process_ref_filename(m.group(2)) in available_files else m.group(0),
        content
    )

def process_directory(directory_path):
    available_files = get_md_files(directory_path)
    filenames = os.listdir(directory_path)
    
    for filename in filenames:
        if filename.endswith('.md'):
            with open(os.path.join(directory_path, filename), 'r', encoding='utf-8') as file:
                content = file.read()

            new_content = replace_links_in_content(content, available_files)

            with open(os.path.join(directory_path, filename), 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Processed {filename}')

if __name__ == '__main__':
    main_directory = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/sql-statements"
    process_directory(main_directory)
