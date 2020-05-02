# Learn Linux

[Learn Linux](https://tryhackme.com/room/zthlinux)

## Summary

1. Linux Operations

   1. `>` is for output redirection erase mode (`echo hello > file`)
      1. `1>`, `>` redirect stdout
      2. `2>` redirects stderr
      3. `&>`, `1&2>` redirect stdout and stderr
   2. `>>` is for output redirection but append mode
   3. `&&` executes second command after the first one successes (`ls && echo`)
   4. `&` background operator: run in background
   5. `$` is used to call variables
      1. To set an environment variable, use `export varname=varval`
   6. `|` pipe: takes output of first command and send as input for the second command
   7. `;` separator: runs two commands not conditioned on the success of the first one

2. `chmod`

   1. Three permission digits: User|Group|Else
   2. Each digit is a 3-bit digit: Read|Write|Execute

3. `chown user:group file` to change owner

4. `find`

   1. `find dir` lists all files in the dir recursively
   2. `find dir -user user` / `find dir -group group`

5. `grep regex <input>` to find things inside input (could be a file or std in or piped)

6. Adding Users and Groups

   1. `sudo adduser userName`
   2. `sudo addgroup groupName`
   3. `sudo usermod -a -G <groups separated by commas> <user>` add user to groups

7. Important Files and Directories

   1. `/etc/passwd` - Stores user information - Often used to see all the users on a system
   2. `/etc/shadow` - Has all the passwords of these users
   3. `/tmp` - Every file inside it gets deleted upon shutdown - used for temporary files
   4. `/etc/sudoers` - Used to control the sudo permissions of every user on the system
   5. `/home` - Contains all user homes
   6. `/root` - The root user's home directory - The equivalent on Windows is C:\Users\Administrator
   7. `/usr` - Where all your software is installed
   8. `/bin` and `/sbin` - Used for system critical files - DO NOT DELETE
   9. `/var` - The Linux miscellaneous directory, a myriad of processes store data in `/var`
   10. `$PATH` - Stores all the binaries you're able to run - same as `$PATH` on Windows

## Solution

1. Introduction

   1. Deploy and complete

2. Methodology

   1. Complete

3. SSH - Intro

   1. Complete

4. SSH - Putty and SSH

   1. Complete

5. Running Commands - Basic Command Execution

   1. Complete

6. Running Commands - Manual Page and Flags

   1. `echo -n hello`

7. Basic File Operations - ls

   1. `-a`
   2. `-l`

8. Basic File Operations - cat

   1. `-n`

9. Basic File Operations - touch

   1. Complete

10. Basic File Operations - Running a Binary

    1. `./hello`
    2. `~/hello`
    3. `../hello`

11. Binary - Shiba1

    1. `touch noot.txt; ./shiba1` -> `pinguftw`

12. su

    1. `-s`

13. Linux Operations - Intro

    1. Complete

14. Linux Operations - >

    1. `echo twenty > test`

15. Linux Operations - >>

    1. Complete

16. Linux Operations - &&

    1. Complete

17. Linux Operations - &

    1. Complete

18. Linux Operations - $

    1. `export nootnoot=1111`
    2. `/home/shiba2`

19. Linux Operations - |

    1. Complete

20. Linux Operations - ;

    1. Complete

21. Binary - Shiba2

    1. `export test1234=$USER; ./shiba2` -> `happynootnoises`

22. Advanced File Operations - Intro

    1. Complete

23. Advanced File Operations - Background

    1. Complete

24. Advanced File Operations - chmod

    1. `460`
    2. `777`

25. Advanced File Operations - chown

    1. `chown paradox file`
    2. `chown paradox:paradox file`
    3. `-r`

26. Advanced File Operations - rm

    1. `-r`
    2. `-f`

27. Advanced File Operations - mv

    1. `mv file /tmp`

28. Advanced File Operations - cp

    1. Complete

29. Advanced File Operations - cd && mkdir

    1. `cd ~`
    2. `mkdir /tmp/test`

30. Advanced File Operations - ln

    1. `ln /home/test/testFile /tmp/test`

31. Advanced File Operations - find

    1. `-perm`
    2. `find /home`
    3. `find / -user paradox`

32. Advanced File Operations - grep

    1. `-n`
    2. `grep boop /tmp/aaaa`

33. Binary - Shiba3

    1. `find /* | grep shiba4` -> `/opt/secrete/shiba4` -> `test1234`

34. Miscellaneous - Intro

    1. Complete

35. Miscellaneous - sudo

    1. `-u`
    2. `sudo -u jan whoami`
    3. `-l`

36. Miscellaneous - Adding Users and Groups

    1. `sudo usermod -a -G test test`

37. Miscellaneous - nano

    1. Complete

38. Miscellaneous - Basic Shell Scripting

    1. Complete

39. Miscellaneous - Important Files and Directories

    1. Complete

40. Miscellaneous - Installing Packages (apt)

    1. Complete

41. Miscellaneous - Processes

    1. Complete

42. Fin ~

    1. Complete

43. Bonus Challenge

    1. `ad91979868d06e19d8e8a9c28be56e0c`

       1. cycle through four shiba users and use `sudo -l` to check user permissions - no users have sudo permission
       2. `find / -user <shiba user> -type f 2>>/dev/null` -> shiba2 has perm to `/var/log/test1234`
       3. `su shiba2`
       4. `cat /var/log/test1234` -> `nootnoot:notsofast`
       5. `su nootnoot`
       6. `sudo -l` -> has sudo permission
       7. `sudo cat /root/root.txt` -> answer
