# Page recipes

Compose these from library parts. Copy goes in `src/data/content.js`. One accent CTA per page.

## Marketing page (studio site)

```
SiteShell
  SiteHeader items=[sections] cta={Contact, plain}
  main
    Section bordered=false space=lg           Hero: Eyebrow, Display (the only h1), Lead,
                                               Cluster: Button accent (the page's one) + Button outline
    Section surface=alt   TitleBlock 01 …      RuledGrid of RuledCell (services, steps)
    Section               TitleBlock 02 …      Grid of Card (work), LayerTag on each
    Section surface=alt   TitleBlock 03 …      About: FounderMonogram + text, LayerLegend
    Section surface=ink   TitleBlock 04 …      Contact: Field + Input/Textarea, RadioTiles,
                                               Button (default; the accent is in the hero)
  SiteFooter email, links
```
Alternate paper and alt; use ink once, for the closing band. Every Section gets
`aria-labelledby` pointing at its heading id; headings that in-page nav jumps to get
`tabIndex={-1}` and `data-section-heading`.

## About page

```
Section bordered=false space=lg   Eyebrow, Display (the only h1), Lead; AssemblingMark (w-40 sm:w-56 lg:w-72) beside it
Section surface=alt  TitleBlock 01 Founders     RuledGrid cols=2: per founder FounderMonogram, LayerTag layer="loy" ("Loy · Founder"),
                                                 Heading level=3 name, Text tone=muted role, Text bio
Section              TitleBlock 02 The name     RuledGrid cols=3: Glyph + Heading level=3 + Text per layer (copy in content.js);
                                                 set SiteFooter showLegend={false} on this page so the key is not shown twice
Section surface=ink  TitleBlock 03 Contact      Button variant="accent" asChild <a href="mailto:…"> (the page's one accent) + TextLink fallback
```
A founder block repeats twice, so make it an app-local composite (`src/components/app/FounderProfile.jsx`).
Never invent biography facts: use content.js copy Mariana has approved, and mark gaps as TODO for her.

## Case study page

```
Section bordered=false   Breadcrumbs (Work / Name), LayerTag, Heading level=1, Lead, MetaList (client, year, status)
Section surface=alt      TitleBlock "01 Problem" + Text
Section                  TitleBlock "02 What we made" + real screenshots (img with alt) in Grid
Section surface=alt      TitleBlock "03 Outcome" + Text (no invented numbers, W4)
Section surface=ink      Button accent "Start a conversation" (the page's one accent)
```

## Contact form

`Field` around every control; `RadioTiles` for the 2 to 4 reasons; `Honeypot`; on submit
error focus a `FormAlert`; on success replace the form with `FormSuccess`. Use
react-hook-form + zod (both ship with Base44). Keep the user's text on errors and offer the
email address as a fallback.

## App screen (Lab product, before phase 3 lands)

`Section bordered=false space=sm` + `Heading level=1` + `Cluster` of actions (one accent at
most) + content in `Card`s or `RuledGrid`. Lists with state use `StatusBadge`. Loading:
`Skeleton` for known shapes, `LinearLoader` for uploads. Nothing yet: `EmptyState` with one
action. Failure: `ErrorState` with retry. Money and dates: `formatNOK`, `formatDate`.
Build missing pieces as app-local composites and note them; AppShell, DataTable, charts and
overlays arrive in phase 3.

## AI feature (Lab, before phase 4 lands)

Only Signal marks AI or computing state: `Badge variant="signal"` or `StatusBadge status="ai"`
on generated content, plus a plain sentence such as "Drafted with AI. Check before using."
Progress: `LinearLoader`. Never use the accent for "Ask AI".
