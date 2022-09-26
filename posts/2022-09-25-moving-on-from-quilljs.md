---
name: Choosing a new Rich Text Editor in 2022
slug: chossing-a-new-rich-text-editor-in-2022
tags:
    - contenteditable
    - QuillJS
    - Parchment
    - SlateJS
---

A few years ago I joined Vanilla Forums and shortly after was tasked with replacing our aging text editor.
I dove in and determined QuillJS was the best choice at the time. It was an active open source project and
while it had a few warts it seemed liked they could be worked around. We built our new "Rich Editor" project
and it has served us pretty well for a few years.

## Background

In 2017 the QuillJS author had a posted a https://medium.com/@jhchen/the-state-of-quill-and-2-0-fb38db7a59b9
a plan to get the project to it's 2.0 release with a few much awaited features.

We developed many improvements on top of the base QuillJS editor including:

-   A rich embedding system for embedding external documents.
-   Nested list support.
-   Support for custom multi-line blocks.
-   Fixes for numerous keyboard traps.
-   Markdown-like shortcuts.
-   Mentions.
-   Floating inline and block formatting UI.

As we neared our launch I reached out to the project maintainer expressing a desire to upstream some patches and expressed
a desire to assist in triaging the projects public issue tracker which had grown to a sizeable amount.

I was astounded to find the next week that my email had been ignored and that I was then blocked from commenting on the public issue tracker. In the following months things became clearer though. The maintainer had started a new company [Slab](https://slab.com/) which
sold help desk software that competed with our products. Over the next 5 years, QuillJS would continue to receive patches to its `master`
branch, but no additional releases, release notes, or migration instructions were ever provided.

## Fast forward to 2022

One of the main features waiting in QuillJS 2.0 was going to be support for tables. We'd deferred our implementation of such a feature
expecting that _eventually_ the project would make a release. Still, requests from our customers had mounted singificantly over the years.

The lack of public stewardship of Quill, poor documentation, and a very risky future forced me to evaluate other options.
It would be simpler to start again, with another project and migrate our existing posts to a new format than to proceed forwards with Quill.

## Evaluating the current landscape of `contenteditable` editors.

Today there are a plethora of options to consider.

### TinyMCE (OSS)

TinyMCE has stood the test of time and has a sustainable business model to drive development of their open source editor.

Notably thought the open source version of TinyMCE is **_missing_** some key feature we would have to re-impement.

-   Rich Media Embeds.
-   Mentions.
-   PowerPaste (Pasting from MS Word or Excel).

Still, TinyMCE's staying power and wide community use put it pretty high on the list.

### TinyMCE (Enterprise/self-hosted)

Those missing features from the OSS version _are_ present in the premium version. As a successful SaaS company we have
the budget to license the full version of the product for our cloud sites. I booked a call with a salespereson from Tiny
and found a few blockers:

-   The pricing scales with the number of customers we gain and is static per use. This means for smaller customers TinyMCE licensing
    is disproportionate to the price of their plan with us. The quoted price was estimated to cost more roughly 1 intermediate developer's yearly salary.
-   The built-in media embed plugin was not configurable enough for our use case, and we would not be provided with the source of the plugin.
    As a result we would have to re-implement this plugin blindly even though we were paying for it.
-   The self hosting seemed to be fairly more complicated than using a javascript library should be, requiring hosting additional servers
    in our production environment.

### SlateJS

SlateJS is the technology I **_wanted_** to go with in 2017, but at the time it had a `0.0x` version number, with no 1.0 in site.
Additionally it was tech maintained by a competitor of ours and had a very uncertain future.

In the end it's document model seemed very smart though, and it was React based which aligned well with our stack.

Since then SlateJS has gone through numerous versions and many breaking changes, but is on a path to stability.
It's document has matured and seems mostly finalized, and the open source community around it seems very active, in particular with the [PlateJS set of plugins](https://plate.udecode.io/docs/playground).

Going forwards I'll be rebuilding our editor on Slate and Plate and documenting my findings on my blog.
