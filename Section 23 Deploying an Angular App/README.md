# Section 23 Deploying an Angular App

## Deployment

### Lesson 339 - Module Introduction

After development, to make the application available to the public, we need to deploy it to a server, so people can visit using the domain from the web.

### Lesson 340 - Deployment Preparation & Steps

Deployment steps

1. Use and check environment variables
2. Polish and test the code
3. `ng build --prod` to use AoT compilation to build the code into dist directory
4. Deploy build artifacts to static host
   1. **Static Host** - a web server that is capable of serving HTML/JS/CSS, but not capable of running any server side language (PHP / NodeJS).
