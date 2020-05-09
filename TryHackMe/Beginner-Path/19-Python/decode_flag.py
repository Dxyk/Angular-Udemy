from base64 import *

f = None
flag = ""

with open("encodedflag.txt", "rb") as f:
    flag = f.read()

    for i in range(3):
        for _ in range(5):
            if i == 0:
                flag = b16decode(flag)
            elif i == 1:
                flag = b32decode(flag)
            else:
                flag = b64decode(flag)

    print(flag)
