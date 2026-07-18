# Prettywraps NG — AI Surprise Booking Assistant

> Don't just say Happy Birthday. Create unforgettable memories.

An AI concierge that helps customers plan a surprise in under three minutes —
recommending packages, generating a real quotation, taking the booking, and
handing off to WhatsApp.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then paste your Anthropic API key
npm run dev
```

Open <http://localhost:3000>.

**The site works without an API key** — the concierge falls back to a simple
scripted mode so you can demo everything. Add the key to switch on the real AI.

---

## 📝 The one file you'll actually edit: `lib/catalog.ts`

**Every price in this project is a placeholder.** They are not your rates. Open
`lib/catalog.ts` and replace them with your real numbers.

That single file drives the whole site — the package cards, the AI's
recommendations, and every quotation it generates. Change a price there and it
updates everywhere, instantly. Same for adding a new package or add-on.

Other things worth editing in the same file:

| What | Where |
|---|---|
| Package names, prices, what's included | `packages` |
| Add-ons (cake, photographer, neon sign…) | `addOns` |
| Budget bands shown on the site | `budgetBands` |
| Occasions customers can pick | `occasions` |

Two more pricing rules live in `lib/quote.ts`:

- `DELIVERY_FEES` — logistics cost per city (placeholder)
- `DEPOSIT_RATE` — currently 70% to lock a date

Daily capacity (how many setups your team can handle in one day) is
`DAILY_CAPACITY` in `app/api/availability/route.ts`, currently 3.

---

## Brand and contact details — `lib/brand.ts`

WhatsApp number, Instagram handle, service areas, and lead time all live here.

---

## 📷 About the Instagram feed — please read

**Instagram does not let a website pull your profile feed automatically.** That
requires the Meta Graph API, which needs a Business account and Meta's app
review — it can't be done by just pasting a profile link.

So the gallery uses Instagram's **official post embed** instead. Each post you
list renders as a real, live Instagram card that stays in sync with the original
post.

To add your work to the gallery, paste post URLs into `instagramPosts` in
`lib/brand.ts`:

```ts
instagramPosts: [
  "https://www.instagram.com/p/DZ8RvO-Dhff/",
  "https://www.instagram.com/p/YOUR_NEXT_POST/",
],
```

Only **public** posts can be embedded.

⚠️ I also couldn't read your handle from the link you sent (Instagram blocks
automated readers), so `instagramHandle` in `lib/brand.ts` is currently the
placeholder `prettywraps_ng`. **Please check it and correct it if it's wrong** —
it's used for the "DM us on Instagram" links.

If you later want a true auto-updating feed, that's a separate piece of work:
connecting an Instagram Business account through the Meta Graph API.

---

## How the AI concierge works

`app/api/chat/route.ts` streams responses from Claude and gives it four tools:

| Tool | What it does |
|---|---|
| `recommend_packages` | Matches packages to occasion + budget |
| `create_quote` | Builds a real itemised quotation |
| `check_date_availability` | Checks the calendar and lead time |
| `save_booking` | Creates the booking and a reference number |

Because the AI can only quote from `lib/catalog.ts`, it can't invent a package,
a price, or a discount. Its personality and rules are the system prompt in
`lib/concierge.ts` — edit that to change how it talks.

**Returning customers:** the browser remembers a customer's phone number, and
the server looks up their history so the AI can greet them by name and reference
what they booked before.

---

## Where bookings are stored

`lib/store.ts` writes to a JSON file in `.data/` (gitignored). That's fine for
local use and for a normal server.

⚠️ **On serverless hosting (Vercel, Netlify) the filesystem is wiped between
requests, so bookings will not persist.** Before going live there, swap the
`read`/`write` functions at the top of `lib/store.ts` for a real database —
Supabase or Postgres. Nothing else in the app needs to change; every other file
talks only to that file's exported functions.

---

## The other two channels

The website concierge is live. WhatsApp AI and Instagram DM AI are presented as
channels on the site, and every path hands off to your real WhatsApp — but
automated replies *inside* WhatsApp and Instagram need separate setup:

- **WhatsApp:** a WhatsApp Business API account (via Meta or a provider like
  Twilio / 360dialog) plus a webhook that calls the same concierge logic.
- **Instagram:** the Instagram Messaging API, which needs a Business account
  connected to a Facebook Page.

The planning brain in `lib/concierge.ts` is deliberately separate from the web
route so both channels can reuse it when you're ready.

---

## Project structure

```
app/
  page.tsx              Landing page
  layout.tsx            Fonts, metadata
  globals.css           Purple luxury theme
  api/chat/             Streaming AI concierge
  api/booking/          Direct booking
  api/track/            Order tracking
  api/availability/     Calendar
components/             UI (concierge, packages, calendar, tracking…)
lib/
  catalog.ts            ⭐ PRICES AND PACKAGES — edit this
  brand.ts              Contact details, Instagram posts
  concierge.ts          AI system prompt and tools
  quote.ts              Quote maths
  store.ts              Bookings and customer memory
  fallback.ts           Scripted concierge (used when no API key)
```
