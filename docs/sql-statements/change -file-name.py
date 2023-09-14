import os

def rename_files_in_directory(directory_path):
    # 列出给定目录下的所有文件
    filenames = os.listdir(directory_path)

    # 循环遍历文件名，对每个文件名进行处理
    for filename in filenames:
        if filename.endswith('.md'):
            # 在文件名前添加 "sql-statement-"
            new_filename = 'sql-statement-' + filename

            # 更改文件名
            os.rename(
                os.path.join(directory_path, filename),
                os.path.join(directory_path, new_filename)
            )
            print(f'Renamed {filename} to {new_filename}')

# 主程序入口
if __name__ == '__main__':
    current_directory = os.getcwd()  # 获取当前目录
    rename_files_in_directory(current_directory)
