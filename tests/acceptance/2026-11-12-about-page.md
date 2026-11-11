# Agent acceptance test 1: About page (phase 1 definition of done)

- Date: 2026-11-12 · Library 0.1.0 · Agent: fresh general-purpose subagent, no prior context
- Brief (one paragraph): build a LoyStudioLab About page (two founders, what Loy/Studio/Lab
  mean, contact by email) in `fixtures/.agent-test`, following only the `loystudiolab-ui`
  skill, with the local registry.

## Result: pass

- Asked no design questions. Installed from the registry with shadcn 4.23.0 (path A).
- Used: SiteShell, SiteHeader, SiteFooter, Section, TitleBlock, Grid, RuledGrid, Stack,
  Cluster, Eyebrow, Display, Heading, Lead, Text, TextLink, AssemblingMark,
  FounderMonogram, LayerTag, Glyph, Button (one accent), Reveal, Rise, useDocumentTitle,
  AccentBudget, Toaster.
- One app-local composite: `FounderProfile` (library parts and tokens only).
- lsl-doctor: 0 errors, 0 warnings. `vite build`: OK. No horizontal scroll at 375px,
  sequential headings, dual focus ring on Tab.

## Gaps it reported, and what changed

| Gap | Fix |
|---|---|
| No About recipe | Added to `references/recipes.md` |
| Accent placement unclear (hero vs closing band) | Rule 1 in the skill now says where |
| Router requirement not documented | Skill install section + SiteHeader setup notes |
| In-page nav wiring inferred from source | Skill step 4 + SiteHeader setup notes |
| LayerLegend copy vs W6 | LAYERS documented as the allowed canonical exception; full sections compose Glyph + Heading |
| LayerTag label for people | Manifest example: `Loy · Founder` |
| AssemblingMark size | className guidance in the manifest |
| Grid had no align prop | `align` added to Grid |
| `--yes` missing | Added to install commands |
| Doctor drift check skipped while public URL is down | `--manifest <lib>/docs/public/manifest.json` documented |
| Skill paths pointed at post-migration folders | Now names today's path first |
| No axe step in apps | Skill explains injecting axe-core in the browser |
| Biography facts | Recipe: never invent facts; mark TODO for Mariana |

Not yet tested: install path B (Base44 sandbox `run_command`) and C (MCP `write_file`)
against a real Base44 app. They need a throwaway Base44 app, which needs Mariana's OK.
