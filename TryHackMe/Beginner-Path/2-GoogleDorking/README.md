# Google Dorking

[Google Dorking](https://tryhackme.com/room/googledorking)

## Summary

1. Search engines use crawlers to search in the world wide web
2. `Robots.txt` are used to restrict crawlers
   1. must be included in the server at root directory
   2. `User-agent`: Specify the type of crawler that can index your site (* allows all user agents)
   3. `Allow`: Specify the directories or file(s) that the crawler can index
   4. `Disallow`: Specify the directories or file(s) that the crawler cannot index
   5. `Sitemap`: Provide a reference to where the sitemap is located (improves SEO)
3. `sitemap.xml` marks how a crawler can get to the webpages. This makes search engines' jobs easier thus sites with a sitemap is more favorable.
4. Google Dorking: advanced search methods for googling
   1. use `"<query>"` to search for exact results
   2. use `site: <query site> <query>` to search for queries living on the query site
   3. use `filetype: <query file type> <query>` to search for a specific file type
   4. use `cache: <url>` to search for google's cached version of the url
   5. use `intitle: <title query>` to search for sites that has the title query in the title

## Solutions

1. Ye Ol' Search Engine

   1. Complete

2. Crawlers

   1. `index`
   2. `crawling`
   3. `keywords`

3. Search Engine Optimization

   1. `Yea`
   2. `Nay`
   3. `83/100`
   4. `0`
   5. `blog.cmnatic.co.uk`

4. Robots.txt

   1. `ablog.com/robots.txt`
   2. `/sitemap.xml`
   3. `User-agent: Bingbot`
   4. `disallow: /dont-index-me/`
   5. `.conf`

5. Sitemaps

   1. `xml`
   2. `map`
   3. `route`

6. Google Dorking

   1. `site: site bbc.co.uk flood defences`
   2. `filetype`
   3. `intitle: login`
