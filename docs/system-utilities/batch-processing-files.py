import os
import re

def process_content(content):
    # 正则表达式匹配 Option ： Option description 格式
    pattern = re.compile(r'^(?P<param_name>\w+)(\s+)\:\s+(?P<param_desc>.+)$', re.MULTILINE)

    # 替换函数
    def replace_format(match):
        param_name = match.group("param_name")
        param_desc = match.group("param_desc")
        return f"**`{param_name}`**\n\n{param_desc}"

    # 使用 re.sub 替换所有匹配的内容
    return pattern.sub(replace_format, content)

def process_directory(directory_path):
    filenames = os.listdir(directory_path)

    for filename in filenames:
        if filename.endswith('.md'):
            with open(os.path.join(directory_path, filename), 'r', encoding='utf-8') as file:
                content = file.read()

            # 如果内容中包含 "## Parameters" 标题，则进行处理
            if "## Options" in content:
                new_content = process_content(content)

                with open(os.path.join(directory_path, filename), 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f'Processed {filename}')

if __name__ == '__main__':
    main_directory = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/system-utilities"
    process_directory(main_directory)
