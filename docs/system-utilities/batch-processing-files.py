import os

def remove_trailing_spaces_from_titles(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                # 修改标题行
                modified = False
                for i, line in enumerate(lines):
                    if line.startswith("#") and line.endswith(" \n"):
                        lines[i] = line.rstrip() + "\n"
                        modified = True

                # 如果有修改，重新写入文件
                if modified:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.writelines(lines)
                    print(f"Processed {filepath}")

if __name__ == "__main__":
    DIRECTORY = "/Users/hashdata/Documents/GitHub/tom-cloudberrydb-site/docs/system-utilities"
    remove_trailing_spaces_from_titles(DIRECTORY)
