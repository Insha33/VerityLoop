# X launch posts: founding-member waitlist

Use `https://runverityloop.com/?utm_source=x#waitlist` for every X link. Signups from that link are stored with source `marketing-site:x`. For one-off campaigns use `?ref=<tag>` (lowercase letters, digits, `-`, `_`, up to 40 characters), for example `?ref=launch-thread`.

Put the link in the first reply, not the main post. X is widely reported to show posts with external links to fewer people; X hasn't confirmed this, so compare reach on your own posts.

## Offer (keep every post consistent with the site)

- 2 months free on your first paid plan (one workspace)
- Priority early access, invited in batches
- A direct line to the founders
- For everyone who joins before public launch; no card required to join

Don't shorten this to "free early access for everyone" or "2 months free on any plan". The site, FAQ and welcome email all use the wording above.

## Option A: single post (279 characters, fits without Premium)

Human-score check: 92.5 PASS (local li-human heuristics; not a third-party AI detector).

> A competitor ships a feature Tuesday. By Thursday there's a 40-message Slack thread: does this matter? Should the roadmap move?
>
> I'm building VerityLoop to answer with cited evidence and honest unknowns. A human decides.
>
> Building in public. Waitlist members get 2 months free 👇

First reply:

> Join here. Sign up before launch and you're a founding member: 2 months free on your first paid plan, priority early access, and a direct line to us.
>
> https://runverityloop.com/?utm_source=x#waitlist

## Option B: launch thread

Human-score check: 77.8 PASS (same heuristics). Every post is under 280 characters.

1/
> I'm building VerityLoop in public, starting today.
>
> It answers one question product teams get wrong more often than they admit:
>
> "A competitor just shipped X. Should our roadmap change?"
>
> What it is, how I'm building it, and what I'll share 🧵

2/
> Today that call gets made from a changelog screenshot, a #product Slack thread and gut feel.
>
> Nobody checks if customers asked for it, whether it's half-built in a Linear or Jira epic, or whether you killed the same idea in Q2 for a good reason.

3/
> The obvious fix is "just ask an LLM". That's the trap.
>
> Ask a model what a competitor launched and you can get a confident answer, a citation that says something else, and no hint of what it doesn't know.
>
> For a roadmap call, confident and wrong is worse than "I don't know".

4/
> So VerityLoop has 5 hard rules:
>
> - every claim links to its source and fetch time
> - facts, vendor claims and model guesses get different labels
> - "unknown" is allowed
> - if your docs disagree, you see both
> - a human decides: ignore, watch, validate, accelerate or reconsider

5/
> I'm an ML engineer, so I'm starting with evals, not features.
>
> Step 1: a test set of 25 real changelog entries and a fake roadmap.
>
> Release targets:
> - 95%+ of citations support their claim
> - 100% of conflicting docs surfaced
> - 0 actions triggered by prompt-injected web pages

6/
> What I'll post here:
>
> - a build log every Friday, with eval numbers even when they're bad
> - architecture calls and what they cost me
> - what I cut. My PRD hit 80k characters; v1 fits on 1 page
> - what product teams tell me on calls

7/
> Waitlist is open. Join before launch and you're a founding member: 2 months free on your first paid plan, priority early access, and a direct line to me.
>
> Stuck on a product call right now? Reply. I'd like to hear it.
>
> https://runverityloop.com/?utm_source=x#waitlist

## Commitments these posts make

Only post them if these are true or will be:

- A build log goes out every Friday (post 6).
- The release targets in post 5 are goals, not results. Report the real numbers when you have them.
- A founder replies to welcome-email and X replies (the "direct line").

## After posting

- Reply to every comment in the first 2 hours.
- Pin the post or thread to your profile.
- Check signups by source in Supabase: `select source, count(*) from waitlist group by source;`
- Replies to the welcome email ("what product decision are you wrestling with?") are customer-discovery input. Log them before planning the next build.
