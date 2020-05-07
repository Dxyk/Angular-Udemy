# RP Web Scanning

[RP Web Scanning](https://tryhackme.com/room/rpwebscanning)

## Summary

1. `nikto` is a vulnerability scanner that can give us useful info about server's app versions, scan with ids, etc
2. `nmap` is a web scanner that detects available services
3. `Zap` is similar to `nikto` with GUI

## Solutions

1. Pull the lever, Kronk!

   1. Deploy and Complete

2. Nikto

   1. `-h`
   2. `-nossl`
   3. `-ssl`
   4. `-p`
   5. `-dbcheck`
   6. `-mutate 3`
   7. `-id admin:PrettyAwesomePassword1234`
   8. `nikto -h <IP>` -> `Apache/2.4.7`
   9. `config`
   10. `-until`
   11. `-list-plugins`
   12. `-Plugins outdated`
   13. `-Plugins tests`

3. Zap

   1. Start Zap and Complete
   2. `URL to attack`
   3. Launch and Complete
   4. `robots.txt`
   5. `/`
   6. `/dvwa/images/`
   7. `HttpOnly`
   8. `Web Browser XSS Protection Not Enabled`
   9. `http://www.dvwa.co.uk/`
   10. `GET`
   11. `POST`
