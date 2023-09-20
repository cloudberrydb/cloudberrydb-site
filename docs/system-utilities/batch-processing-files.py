import os

def batch_rename():
    current_directory = os.getcwd()  # 获取当前目录

    for filename in os.listdir(current_directory):  # 遍历当前目录下的所有文件和文件夹
        if filename.endswith(".html.md"):  # 检查文件是否以 .html.md 结尾
            new_filename = filename.replace(".html.md", ".md")  # 创建一个新的文件名，将 .html.md 替换为 .md
            os.rename(os.path.join(current_directory, filename), os.path.join(current_directory, new_filename))  # 重命名文件

if __name__ == "__main__":
    batch_rename()
