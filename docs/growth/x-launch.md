# X launch posts: founding-member waitlist

Use `https://runverityloop.com/?utm_source=x#waitlist` for every X link. Signups from that link are stored with source `marketing-site:x`. For one-off campaigns use `?ref=<tag>` (lowercase letters, digits, `-`, `_`, up to 40 characters), for example `?ref=launch-thread`.

Put the link in the first reply, not the main post, because X shows posts with external links to fewer people.

## Offer (keep every post consistent with the site)

- 2 months free on any paid plan at launch
- Early access before the public launch
- A direct line to the founders
- For everyone who joins before public launch; no card required

## Option A: single post (fits 280 characters)

> Competitor ships a feature. Your team asks: does this matter to us? Should the roadmap move?
>
> I'm building VerityLoop to answer that with evidence: cited sources, explicit unknowns, and a human making the call.
>
> Building it in public from today. Waitlist gets 2 months free 👇

First reply:

> Join here. Everyone who joins before launch is a founding member: 2 months free, early access, and a direct line to us.
>
> https://runverityloop.com/?utm_source=x#waitlist

## Option B: launch thread

1/
> I'm building VerityLoop in public, starting today.
>
> It's an AI system for one question every product team gets wrong at some point:
>
> "A competitor just shipped X. Should our roadmap change?"
>
> Here's the problem, how I'm building it, and what I'll share 🧵

2/
> Today that question is answered with gut feel, a Slack thread, and a screenshot of a changelog.
>
> Nobody checks whether customers actually asked for it, whether we already built half of it, or whether we rejected it last quarter for a good reason.

3/
> The obvious fix is "ask an LLM". That's the trap.
>
> LLMs will happily tell you a competitor launched something they didn't, cite a page that says something else, and sound sure about things nobody knows.
>
> For roadmap decisions, a confident wrong answer is worse than no answer.

4/
> So VerityLoop is built around a few rules:
>
> - every claim links to its source and retrieval time
> - verified facts, vendor claims, and inferences stay separate
> - "unknown" is a valid answer
> - conflicting evidence stays visible
> - a human makes the decision, always

5/
> As an ML engineer, I'm starting with evals, not features.
>
> Before shipping, the system has to hit targets like:
> - ≥95% of cited sources actually support the claim
> - 100% of conflicting internal docs surfaced
> - zero unauthorized actions from prompt-injected web pages

6/
> What I'll share here:
>
> - weekly build logs with real eval numbers
> - architecture decisions and the tradeoffs
> - what broke and what I cut
> - what I learn talking to product teams

7/
> Waitlist is open. Everyone who joins before launch becomes a founding member: 2 months free, early access, and a direct line to me.
>
> And if you're wrestling with a product decision right now, reply. I'd love to hear it.
>
> https://runverityloop.com/?utm_source=x#waitlist

## After posting

- Reply to every comment in the first 2 hours.
- Pin the post or thread to your profile.
- Check signups by source in Supabase: `select source, count(*) from waitlist group by source;`
- Replies to the welcome email ("what product decision are you wrestling with?") are customer-discovery input. Log them before planning the next build.
