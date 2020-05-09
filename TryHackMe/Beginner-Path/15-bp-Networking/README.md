# BP Networking

[BP-Networking](https://tryhackme.com/room/bpnetworking)

## Summary

1. IPv4 Addresses

   1. 4 digits separated by `.`. Each digit is 8 bits from 0-255

   2. IP Address Classes (defined by the first digit bits)
      1. Class A: 1 - 127
         1. First bit is `0`
         2. Used by large networks
         3. 8 bits for network, 24 bits for hosts
      2. Class B: 128 - 191
         1. First 2 bits are `10`
         2. Used by medium networks
         3. 16 bits for network, 16 bits for hosts
      3. Class C: 192 - 223
         1. First 3 bits are `110`
         2. Used by smaller networks
         3. 24 bits for network, 8 bits for hosts
      4. Class D: 224 - 239
         1. First 4 bits are `1110`
         2. Multicast IP address (1 source to multiple dest)
      5. Class E: 240 - 255
         1. First 5 bits are `11110`
         2. Experimental IP address

   3. Private Address Spaces

      Used for local communication within private network

      1. Class A: `10.0.0.0` - `10.255.255.255`
         1. Private ranges for business networks
      2. Class B: `127.16.0.0` - `127.31.255.255`
      3. Class C: `192.168.0.0` - `192.168.255.255`
         1. Default private ranges for home network are `192.168.0.0` and `192.168.1.0`

   4. IP notation `/8`, `/24`

      1. `/8` means `1111 1111. 0000 0000. 0000 0000. 0000 0000` 8 bits are taken
      2. `/24` means `1111 1111. 1111 1111. 1111 1111. 0000 0000` 24 bits are taken

   5. In a `/24` address, two addresses are reserved
      1. `0` - Network address
      2. `255` - Broadcast address

   6. `127.0.0.1` - Loopback Address - Reserved for testing on individual computers

   7. `0.0.0.0` - Current Network - Reserved for unroutable packets - Can be referred as all IPv4 addresses on local machine

## Solutions

1. IP addresses

   1. `5`
   2. `E`
   3. `3`
   4. `A`
   5. `256` (`/24` => 8 bits not taken => $2^8 = 256$ possibilities)
   6. `Network`
   7. `Broadcast`
   8. `Gateway`
   9. `127.0.0.1`
   10. `0.0.0.0`

2. Binary to Decimal

   1. `146` ($2^1 + 2^4 + 2^7 = 148$)
   2. `119`
   3. `255`
   4. `197`
   5. `246`
   6. `19`
   7. `129`
   8. `49`
   9. `120`
   10. `240`
   11. `59`
   12. `7`

3. Decimal to Binary

   1. `11101110`
   2. `00100010`
   3. `01111011`
   4. `00110010`
   5. `11111111`
   6. `11001000`
   7. `00001010`
   8. `10001010`
   9. `00000001`
   10. `00001101`
   11. `11111010`
   12. `01110010`

4. Address Class Identification

   1. `A`
   2. `B`
   3. `C`
   4. `B`
   5. `C`
   6. `A`
   7. `C`
   8. `D`
   9. `B`
   10. `A`
   11. `A`
   12. `C`
