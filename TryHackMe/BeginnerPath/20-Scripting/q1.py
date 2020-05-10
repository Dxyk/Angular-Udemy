from base64 import *

with open("./b64.txt", "r") as f:
    flag = f.read()
    for i in range(50):
        flag = b64decode(flag)
    print(flag)