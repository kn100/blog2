---
title: "The Perils of RSS"
description: "RSS is a wonderful technology, but there is a pitfall content creators need to be aware of, one which can destroy RSS readership overnight."
slug: "rss-perils"
tags: ["stories", "personal", "software"]
date: 2022-03-09T22:00:00+01:00
images: ["/posts/rss-perils/featured.jpg", "/posts/rss-perils/intro.jpg"]
featured_image: "/posts/rss-perils/featured.jpg"
draft: false
containsAffiliate: false
hnDiscussion: "https://news.ycombinator.com/item?id=30621295"
redditDiscussion: "https://www.reddit.com/r/web_design/comments/takogm/the_perils_of_rss/"
dangerous: false
---

RSS, or RDF Site Summary, Rich Site Summary and most recently
Really Simple Syndication, is a standard that allows readers to aggregate
multiple blogs into one 'reader' interface, which displays these blogs posts in
a standardised way. It's an old standard, developed in 1999 at Netscape for use
on their `my.netscape.com` portal. It allowed users to import RSS feeds from
other websites and have their content appear on Netscapes feed syndicator.

The concept is was simple. Sites which wished to have their content
aggregated would publish an RSS feed - which was an XML document that had a
standard set of tags to describe the content on the site in a standard fashion.
You can see an example of an RSS feed [right here](https://kn100.me/rss/).
Many, many websites published RSS feeds through the years after the death of
Netscape in 2003, and similarly many pieces of self hosted software that did not
require users to make use of a website to view their RSS feeds, and for a while
this seems to be the main consumption model for RSS. Tools like [Mozilla
Thunderbird](https://en.wikipedia.org/wiki/Mozilla_Thunderbird), [AOL
Explorer](https://en.wikipedia.org/wiki/AOL_Explorer), [Claws
Mail](https://en.wikipedia.org/wiki/Claws_Mail), [IBM Lotus
Notes](https://en.wikipedia.org/wiki/IBM_Lotus_Notes) (Which crazily was
discontinued almost exactly 2 years ago, and saw its first release 33 years
ago!), [Firefox](https://en.wikipedia.org/wiki/Firefox), [Microsoft
Outlook](https://en.wikipedia.org/wiki/Microsoft_Office_Outlook) and many more
all supported RSS feed syndication of one form or another.

Then came Google Reader in 2005. Those who love RSS generally speak fondly of
Google Reader. It was a [fairly long lived tool by Google
standards](https://killedbygoogle.com/) - lasting 7 years, and eventually being
killed in 2013. It is hard to estimate just how many people were using Google
Reader, but competitor in the space Feedly announced that in the 2 weeks after
Readers discontinuation over 3 million people joined.

What is interesting to note here is the flip-flopping between 'cloud' based
readers, like `my.netscape.com`, and offline readers like Thunderbird. I'm not
certain why this is, but RSS definitely lends itself very well to server side
processing, especially in the days prior to the enormous slow React apps and the
browser per application Electron apps of today. Power users were also probably more
open to the idea of giving up the keys to who controls their data in the name of
convenience with tools like Google Reader, but that is just a guess.

Also of note is the fact that RSS is very alive and well today.
[Feedly](https://feedly.com/) seems to be one of the largest feed readers in use
by users today (at least based on the server logs for `kn100.me`). I can tell
this because when I check my Nginx server logs, when Feedly requests my feed,
their crawler reports the number of subscribers to my feed  in its user agent via
Feedly. This is a lovely feature, by the way!

Feedly and other cloud based RSS aggregators pose an interesting problem
however, and therein lies the peril of RSS. Firstly, I need to quickly describe
how my RSS feed comes to exist. I myself am not a user of RSS, but enough
readers complained about the lack of a feed that I eventually added one.
[Hugo](https://gohugo.io), the static site generator I use, can easily generate
RSS feeds, if provided a template for doing so. Such templates look like this:

```xml
{{- $pctx := . -}}
{{- if .IsHome -}}{{ $pctx = .Site }}{{- end -}}
{{- $pages := slice -}}
{{- if or $.IsHome $.IsSection -}}
{{- $pages = $pctx.RegularPages -}}
{{- else -}}
{{- $pages = $pctx.Pages -}}
{{- end -}}
{{- $limit := .Site.Config.Services.RSS.Limit -}}
{{- if ge $limit 1 -}}
{{- $pages = $pages | first $limit -}}
{{- end -}}
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ if eq  .Title  .Site.Title }}{{ .Site.Title }}{{ else }}{{ with .Title }}{{.}} on {{ end }}{{ .Site.Title }}{{ end }}</title>
    <link>{{ .Permalink }}</link>
    <description>Recent content {{ if ne  .Title  .Site.Title }}{{ with .Title }}in {{.}} {{ end }}{{ end }}on {{ .Site.Title }}</description>
    <generator>Hugo -- gohugo.io</generator>{{ with .Site.LanguageCode }}
    <language>{{.}}</language>{{end}}{{ with .Site.Author.email }}
    <managingEditor>{{.}}{{ with $.Site.Author.name }} ({{.}}){{end}}</managingEditor>{{end}}{{ with .Site.Author.email }}
    <webMaster>{{.}}{{ with $.Site.Author.name }} ({{.}}){{end}}</webMaster>{{end}}{{ with .Site.Copyright }}
    <copyright>{{.}}</copyright>{{end}}{{ if not .Date.IsZero }}
    <lastBuildDate>{{ .Date.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</lastBuildDate>{{ end }}
    {{ with .OutputFormats.Get "RSS" }}
      {{ printf "<atom:link href=%q rel=\"self\" type=%q />" .Permalink .MediaType | safeHTML }}
    {{ end }}
    {{ range $pages }}
    <item>
      <title>{{ .Title }}</title>
      <link>{{ .Permalink }}</link>
      <pubDate>{{ .Date.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</pubDate>
      {{ with .Site.Author.email }}<author>{{.}}{{ with $.Site.Author.name }} ({{.}}){{end}}</author>{{end}}
      <guid>{{ .Permalink }}</guid>
      <description>{{ safeHTML "<![CDATA[" }}{{- .Content | safeHTML -}}{{ safeHTML "]]>" }}</description>
    </item>
    {{ end }}
  </channel>
</rss>
```

In this template, I expose my entire post content for all posts on my blog. The
RSS feed output seems to work just fine, and those passionate RSS users I
mentioned earlier were perfectly happy with this, until recently. I just rebuilt
this blog from the ground up. I did this because when I first built `kn100.me`,
I had very little idea what I was doing with Hugo, and the codebase (if you can
call it that!) had gotten very messy, the CSS had gotten messed up, and it was
getting more and more difficult to manage. I created a brand new Hugo blog,
ported all my content across, reorganised all my static assets, ensured all the
permalinks hadn't changed, actually properly customised my templates, and was
pretty pleased with the result. I deployed it, and all seemed well.

A few days later, another project of mine, the [Cybiko Game
Archive](/cybiko-archive/) microservice I'd written to serve up a catalogue of
games that existed for the Cybiko was reporting errors. Unfortunately, a Script
Kiddie had found it, and was bombarding it with dumbass requests to
`/wp-admin.php`, `/admin`, etc, and the code was dutifully doing exactly what I
told it to, which was to log it. I didn't really see the point of reworking this
microservice to deal with this, but didn't want to spend much time on it, and I
didn't want to risk turning logging off, so I decided to do something more
drastic.

The Cybiko Game Archive service is fairly basic. I give it a directory full of
content, and it creates an in memory index of it, which is then served using Go
templates. The pages it produces do not change often, so are a good candidate
for being static content, so I rewrote it to optionally export Markdown, which I
could import into a new section of my blog, where Hugo would be responsible for
generating the pages. The result of that work is what you now see on the site.
This reduced the administrative overhead of hosting it, and meant that I could
deploy it along with my blog, no problem.

This all went very well, and I ended up with a fairly acceptable result, which I
later deployed. The Cybiko Archive sans a microservice was live, improving
administrability, security and performance.

A few hours later, a reader tweeted at me asking why their RSS reader was
bombarding them with literally hundreds of pieces of content that weren't my
usual kind of content. I investigated, and came across the fact that my RSS feed
now listed every single Cybiko game, along with my regular posts.
These Cybiko game posts were never intended to go into the RSS feed, and I
incorrectly assumed that my RSS generation logic would not generate entries for
posts that were not part of the main section of the blog.

{{< figure src="/posts/rss-perils/intro.jpg" alt="A photo showing Feedly reader containing hundreds of Cybiko game posts" >}}

This should be an easy fix, I thought, I'll quickly check out the template for
RSS generation and add a filter, so that it would only generate entries for
pages that are part of the main section of my blog, called `posts`.

```go
Find: {{ range $pages }}
Replace: {{ range (where .Site.Pages ".Section" "posts") }}
```

I regenerated the static pages, deployed them, and called it a night. The next
day, another reader contacted me reporting exactly the same thing. And a third.
And a fourth. I quickly figured out they were all using Feedly, and then later
learned that while Feedly is quite happy to add whatever content you add
to your RSS feed to their internal store, they do not remove content that you
remove. This is fairly similar to what a lot of RSS reader software that the
user installs on their computer does, however the cloudy nature of Feedly removes an important
avenue of control from the user. With RSS reader software, it is possible
to remove and re-add a feed, thereby grabbing a brand new copy of it. When a
content creator like myself makes an error like this, users can fairly easily do
this after the mistake had been corrected, mark everything below their most
recently read post as read, and get on with their life. Not so with Feedly,
since it does not appear they ever remove content that was removed from an RSS
feed. It's been a week since this issue was first reported to me, and there does
not appear to be anything I can do about it.

I attempted contacting Feedly via Twitter and via Email, but have not heard back
from them. Unfortunately, any Feedly users who were subscribed or now subscribe
to my blog now just have to deal with it, and there is as far as I know
absolutely nothing I can do about it from my end. I just have to apologize to my
readers. Therein lies the peril of RSS.

The point I hope to make clear is that if you've never checked, your RSS
readership is likely larger than you realise. It was certainly far larger than I
realized. kn100.me is a tiny blog, and I've been enjoying the slow growth that
being on the internet for a while brings. I do this for fun, and have made
exactly no money from doing it. Losing a few RSS users is sad (and I've
definitely seen a dip in my Feedly readership), but is not a disaster for me. If
you live off of blogging, be very careful with your RSS feed. One mistake can
permanently wreck your RSS feed for users of cloudy platforms you have no
control over.

