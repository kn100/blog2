---
title: "Weirdo Erying 11800H Engineering Sample Motherboard"
description: "Motherboard bios"
slug: "erying-bios"
tags: ["hardware"]
date: 2023-04-18T23:46:00-05:00
draft: true
containsAffiliate: false
hnDiscussion: ""
redditDiscussion: ""
dangerous: true
---

Hello,

So, the board I got was from this [\[THIS ALIEXPRESS LISTING\]](https://www.aliexpress.com/item/1005005042384971.html).

It is labelled **Polestar G613 Pro** (Erying/11th Core i7 ES 2.2GHz).

See [\[THESE PHOTOS\]](https://imgur.com/a/0ZmoFe3) to see what my board specifically looks like. I've also attached photos I took of how the BIOS looked before and after the flash process.

Before I provide the link, I just want to say one final time - **I have \*NO MORE\* information about this bios other than what I've said here.** I do not know what boards it works with. If you try this, **it might brick your board**. I have NO idea. Please don't blame me if it does! It's probably a safe assumption that this update will ONLY work with boards that look EXACTLY like mine.

The seller provided me with this link: [\[10729-11代主板BIOS更新工具\]](https://1drv.ms/u/s!ApFYLYt6tVaEshktkKYNzoBBBpie?e=P0aCgJ). (Translated: BIOS update tool for the 10729-11th generation motherboard).

The instructions within are in Chinese, but I provide a translation below, courtesy ChatGPT.

`1. Choose a regular USB drive and format it as FAT32. Do not use other bootable devices such as PE or DOS.`

`2. Copy the entire uncompressed EFI folder to the root directory of the USB drive for BIOS flashing.`

`3. Insert the USB drive into the USB port on the motherboard that needs to be updated, and press the Delete key on the keyboard during startup to enter the motherboard BIOS interface.`

`4. In the BIOS interface, go to the SAVE & EXIT module and select the UEFI boot option starting with the USB drive, and confirm flashing.`

`5. At this point, you will enter the shell interface of UEFI boot, where the program for flashing the motherboard BIOS will automatically execute. Do not interrupt the flashing process, or it may cause the motherboard to fail to start up.`

`6. The BIOS flashing process takes several seconds to several minutes, so please be patient.`

`7. When the motherboard displays a green message indicating that the update is complete, it means that the motherboard BIOS has been updated.`

`8. After updating the BIOS, the motherboard must be directly disconnected from the AC power supply. Short-circuit the CLR pin on the motherboard for 3 seconds, then power on and enter the BIOS. Press F9 to load the optimized values, and press F10 to save and reboot before resuming normal use.`

If you do decide to give this a go, let me know how it goes. I'd be very curious.