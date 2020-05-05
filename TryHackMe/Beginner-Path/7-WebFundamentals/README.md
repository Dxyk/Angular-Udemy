# Web Fundamentals

[Web Fundamentals](https://tryhackme.com/room/webfundamentals)

## Summary

1. DNS request: map url to ip address

2. HTTPS uses encryptions to prevent third party viewing and modifying the data

3. HTTP usually on port 80, and HTTPS usually on port 443

## Solutions

1. Introduction and Objectives

   1. Complete

2. How do we load websites?

   1. `GET`
   2. `80`
   3. `css`

3. HTTP - Verbs and Request Formats

   1. `post`
   2. `get`
   3. `nay`
   4. `418`
   5. `401`

4. Cookies

   1. Complete

5. Mini CTF

   1. `curl -X GET http://10.10.227.132:8081/ctf/get` -> `thm{162520bec925bd7979e9ae65a725f99f}`
   2. `curl -X POST --data "flag_please" http://10.10.227.132:8081/ctf/post` -> `thm{3517c902e22def9c6e09b99a9040ba09}`
   3. In dev console: `fetch("http://10.10.227.132:8081/ctf/getcookie")` -> `console.log(document.cookie)` -> `thm{91b1ac2606f36b935f465558213d7ebd}`
   4. In dev console: `document.cookie = "flagpls:flagpls"` -> `fetch("http://10.10.227.132:8081/ctf/sendcookie")` -> `thm{c10b5cb7546f359d19c747db2d0f47b3}`
