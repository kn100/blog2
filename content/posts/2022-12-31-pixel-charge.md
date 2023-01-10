---
title: "How the Pixel 6 Pro charges - In Graphs"
description: "I decided to log a charging session of my Pixel 6 Pro to see what charging looked like. The results were pretty interesting."
slug: "pixel6pro-charging"
tags: ["hardware"]
date: 2022-12-31T16:00:00-05:00
images: ["/posts/pixelcharge/mahvslevel.png","/posts/pixelcharge/mahvsvoltage.png"]
featured_image: "/posts/pixelcharge/featured.png"
draft: false
containsAffiliate: true
hnDiscussion: ""
redditDiscussion: ""
dangerous: false
---

I was bored, and was curious to know what the charging behaviour of my Pixel 6 Pro looked like. I decided to use a Ugreen Nexode 100w USB-C charging brick with a Macbook charging cable as the power supply, and left my phone in its case. I note this because I will in the future perform this same test with the phone artificially cooled to see how much of a difference temperature makes to charging rate. I picked the Ugreen Nexode PSU because it has the widest support for quick charging standards I've ever seen. It supports all sorts of weirdo standards, and I highly recommend owning one. It supports (and I am sure this is not an exhaustive list):
* Huaweis' weirdo Supercharge standard
* USB PD 2.0 and 3.0
* Qualcomm Quickcharge 2.0, 3.0, and 4.0
* Programmable Power Supply (PPS) charging as used by various Samsung phones and laptops
* Adaptive Fast Charging (AFC) as used by various other Samsung devices
* Super Fast Charging (SFC) as used by various other more different Samsung devices,

Every single device I've plugged into this absolute unit of a power supply has charged as fast as I've ever seen it charge, and its 3 USB C ports can even charge multiple laptops. [Buy one from this here affiliate link](https://www.amazon.co.uk/gp/search?ie=UTF8&tag=kn100-21&linkCode=ur2&linkId=10bdf26aabcc71667fdb0fc8ca3e232d&camp=1634&creative=6738&index=computers&keywords=Ugreen&nbsp;Nexode&nbsp;Charger). Highly recommended.

I decided I'd let the phone drain to roughly 10%, and then not touch it for a full charging session. It was placed in a room that is held pretty steadily at 22 degrees centigrade. I should also note this Pixel 6 Pro is only around 8 months old, but I'd estimate the battery is a little more worn than usual due to some extremely heavy use it sustained while it was my only connection to the internet.

I quickly whipped up a terrible shell script that used `adb` wirelessly to log out the values. I can't take all the credit for the terribleness, it was actually authored by Chat GPT - my new favourite tool for quickly hacking up prototypes of terrible shell scripts. When it does the terribleness, I feel less bad about it!

```bash
#!/bin/bash

while true; do
  timestamp=$(date +%s)
  adb shell dumpsys battery | grep -Eo '[0-9]+' | tr '\n' ',' >> battery.csv
  echo "$timestamp" >> battery.csv
  echo >> battery.csv
  sleep 30
done
```

One complete charging session later, I wished I'd sampled more frequently than every 30 seconds, but the resolution was high enough to observe a couple interesting things. Firstly, a charge from 11% to 100% reported took 1 Hour, 43 Minutes and 35 Seconds. Internet reports suggest 2 hours for a full charge, so this seems to indicate it is charging as fast as it can.

Firstly, I decided to take a look at how the self reported charge level (in percent) compared to the temperature the battery reported.

{{< figure src="/posts/pixelcharge/tempvslevel.png" alt="A graph showing Charge level vs Battery Temperature" >}}

This graph showed something I was expecting. We can see at around 50% charge, the temperature of the battery peaks at around 34.7c. Then, the charging speed drops a bit, and the temperature drops. 

Next up, I was curious how the battery voltage changed over time. I decided to compare it against the self reported level.

{{< figure src="/posts/pixelcharge/levelvsvoltage.png" alt="A graph showing Charge level vs Battery Voltage" >}}

Here, again, when the battery hits 50%, the battery voltage drops precipitously, indicating a drop in charging power. It then steadily rises to its observed maximum of 4.42v, and stops, indicating the cell is full. Another interesting detail we can see in this graph is the cells voltage keeps rising even as the phone reports itself 100% full, indicating that the phones own estimations were slightly off. I decided to dig deeper.

Next I graphed the mAh figure that the phone exposes against its voltage. 

{{< figure src="/posts/pixelcharge/mahvsvoltage.png" alt="A graph showing Battery mAh vs Battery Voltage" >}}

With Li-ion cells such as the one we find inside the Pixel 6 Pro, we expect to observe a fairly steady voltage through a significant portion of the charge cycle, as these cells try their best to hold a high voltage for as long as possible before rapidly dropping when the cell is almost empty. This is only true when they're charged with a relatively constant current. Modern phones do not charge with a constant current however, and vary it in various ways to try to preserve the health of the battery and to control their heat output. We can however observe this behavior somewhat when the battery cell voltage hits roughly 4400mV. 

Indeed, the phone did keep charging when its own battery gauge reported 100%, gaining a whole 144mAh of charge, and the battery voltage rising another 6mV. It's hard to know exactly why this is, but it could just be a case of the phone trying to encourage you to remove the phone from the charger slightly below 100% to avoid extra battery wear, or just the charging gauge calibration being slightly off. I also should note that the phones "adaptive charging" options were enabled, which assumedly will have some effect on charging. I will perhaps perform this test again with these options disabled in future to see how that affects the charge curve. 

To really see this, I graphed battery level against battery mAh.

{{< figure src="/posts/pixelcharge/mahvslevel.png" alt="A graph showing Battery mAh vs Battery Level" >}}

Sure enough, we can see this behavior here too. If you're interested in the raw data, you can find it [here](https://docs.google.com/spreadsheets/d/1wYNaqomdeV5HMvHmbBONzXdz_tkzHq3CcJR1tpj9uZc/edit?usp=sharing).

