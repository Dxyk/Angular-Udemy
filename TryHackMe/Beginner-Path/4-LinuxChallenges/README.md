# Linux Challenges

[Linux Challenges](https://tryhackme.com/room/linuxctf)

1. `ssh <username>@<ip>`
   1. 3
2. Basics
   1. `cat flag1.txt` - peek file content
   2. `su - bob` - switch user to bob
   3. `ls -al` - ls all files
   4. `crontab -l`
      1. `crontab`: a tool to schedule commands to run automatically / periodically.
   5. `grep -rnw ~ -e "flag5"`
      1. search recursively under dir `~` for pattern `"flag5"` and print row numbers
   6. `grep -rnw ~ -e "flag6"`
      1. `cat /home/flag6.txt | grep c9`
   7. `ps aux | grep flag`
   8. `tar -xvzf flag8.tar.gz`
   9. `cat /etc/hosts`
      1. `etc/hosts` stores a bunch of hosts known to the machine. It is an addition to the DNS name resolution service.
   10. `cat /etc/passwd`
3. Linux Functionality
   1. `cat .bashrc` check for alias
   2. `cat /etc/update-motd.d/00-header`
      1. `motd` - Message Of The Day: display message as users log in
   3. `diff script1 script2`
   4. `cat /var/log/flagfourteen.txt` - logs are usually stored under `/var/log/`
   5. `cat /etc/*release` - system release version
   6. `ls /media/f/l/a/g/1/6/is/`
   7. `su - alice`
      1. `TryHackMe123`
      2. `cat flag17`
   8. `cat .flag18`
   9. `sed -n 2345p flag19` - read the 2345th line of the file
4. Data Representation, Strings and Permissions
   1. `cat flag20 | base64 --decode`
      1. Data is base64 encoded in order to remain intact during transportation
   2. `less flag21.php`
   3. `cat flag22 | xxd -r -p` - hex to ascii converter
   4. `cat flag23 | rev` - reverse a string
   5. `strings /home/garry/flag24 | grep flag` - reveal readable string
   6. pass
   7. `find / -xdev -type f -print0 2>/dev/null | xargs -0 grep -E '^[a-z0-9]{32}$' 2>/dev/null` this is magic...
   8. `sudo cat /home/flag27`
   9. `uname -a`
   10. procedure
       1. `cat flag29 | tr -d ' ' > flag29_noS`
       2. `cat flag29_noS | tr -d '/n' > flag29_noSN`
       3. `cat flag29_noSN`
5. SQL, FTP, Groups and RDP
   1. `curl localhost`
   2. MySQL
      1. `mysql -u root -p`
      2. `mysql> SHOW DATABASES;`
   3. MySQL
      1. `mysql> USE database_2fb1cab13bf5f4d61de3555430c917f4`
      2. `mysql> SHOW TABLES;`
      3. `mysql> SELECT * FROM flags;`
   4. pass
   5. `cat /home/bob/.profile`
   6. `printenv` - print all system environment variables
   7. `getent group`
   8. user and group
      1. use `id` to check which group the user is in
      2. use `ls -l` to check which groups have permission to read
   9. 

