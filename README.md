# 🎩 Profile pictures! (featuring Redis!)

The previous version of this, made by [sampoder](https://github.com/sampoder) used a S1 DB, which I now made to use Redis, so I could selfhost this easier. I also removed the secondary Slack Token option, but I potentially might add that back soon? It also now shows the country the person that last changed my pfp was based from! Well, their IP country and if they're using a VPN. I also added ratelimiting because, people kept getting too silly.

Just set a SLACK_TOKEN and a REDIS_URL to your .env, upload some images, and you should be good to go!

You should also change the website in /pages.