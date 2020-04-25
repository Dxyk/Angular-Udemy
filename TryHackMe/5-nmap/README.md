# NMAP

## Summary

- **syn scan**: the default scan mode. Reveals all possible open port on a machine
- `nmap -A -T5 -sV --script vuln -oN <output file path> <IP address>`

## Solution

1. Deploy

2. Quiz

   1. `-h`
   2. `-sS` - syn scan
   3. `-sU` - UDP scan
   4. `-O` - operating system guess
   5. `-sV` - service version
   6. `-v` - verbose
   7. `-vv` - very verbose
   8. `-oX` - save result to output xml file
   9. `-A` - aggressive scan
   10. `-T5` - set timing to max level
   11. `-p` - scan for a specific port
   12. `-p-` - scan all ports
   13. `--script` - enable scripting engine
   14. `--script vuln` - run all script under vulnerability category
   15. `-Pn` - run nmap without pinging the host

3. nmap scanning

   1. `nmap -sS`
   2. `2`
   3. `tcp`
   4. `6.6.1p1`
   5. `httponly`
   6. `http-slowloris-check:`
