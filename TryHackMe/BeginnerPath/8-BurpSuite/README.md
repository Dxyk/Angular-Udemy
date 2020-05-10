# Burp Suite

[Burp Suite](https://tryhackme.com/room/learnburp) (referred to as Burp) is a graphical tool for testing Web application security.

In this set of tutorials we will go through how to set up Burp to intercept traffic on your web browser. For the purpose of this tutorial I will be using the free version.

## Summary

1. Burp Suite intercepts traffic on web browsers
2. Hook up Burp with machine by rerouting proxy to 127.0.0.1:8080
3. Burp will intercept web traffic until forward button is clicked
4. HTTPS will cause browsers to throw error because the request was intercepted. To get around this, a certificate is needed

## Soln

1. Download and Configure Burp
   1. Download and Install [Burp Suite](https://portswigger.net/burp/communitydownload).
   2. Reroute machine proxy to 127.0.0.1:8080 so Burp can intercept the web traffic.
   3. Get certificate from [http://burp/](http://burp/) and add to system.
2. Deploying machine
   1. Connect openvpn
   2. Connect openvpn
   3. Deploy machine
   4. Go to machine ip in browser
   5. Login with credentials:
      * username: `admin`
      * password: `password`
3. Burp Intruder
   1. In Burp, under proxy -> options -> intercept client requests -> add, add domain name matching IP address.
   2. proxy -> intercept intercepts all requests with arguments.
   3. Right click on raw -> send to intruder -> intruder -> clear § to remove attacking field
   4. Add § for password
   5. 
