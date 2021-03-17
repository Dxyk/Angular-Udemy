# Section 25 Angular Universal

## Angular Universal

### Lesson 389 - Module Introduction

**Angular Universal** allows the front-end app to pre-render on the server. When the user visits the page, the initial rendering is already done. Only subsequent actions are handled by the browser.

For normal Angular apps, all the rendering are done by the compiled JS file instead of the HTML file.

This could be disadvantageous because

- If the user has slower internet connection, the JS files will not download as quickly, and the rendering speed will be impacted.
- Search Engines use Crawlers to search for website contents. It usually only search for the initially downloaded webpage instead of waiting for all the scripts to load.

Angular Universal pre-loads the page, and thus returns a proper HTML page back from the server, which helps solve/mitigate the above issues. After the page is loaded, Angular takes over again and handles the subsequent actions.
