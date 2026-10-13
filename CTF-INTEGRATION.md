# MANU Protocol — Yellow Zone investigation integration

The former standalone CTFs have been retired. Each of the five buildings now opens the same local social-trace investigation terminal.

- 10 fictional accounts
- 34 artifacts across Posts, Highlights, Stories, and Notes
- Search, building filter, archived comments, and persistent evidence board
- One shared recovery signature: `FLAG{CONTINUITY_841_0217_UNIT404}`
- One shared success state: the terminal transforms into the recovered Continuity Ledger

The narrative and full spoiler walkthrough are in `YELLOW_ZONE_STORY_BIBLE.md`. Player-facing content lives in `src/data/investigationData.ts` and the terminal UI in `src/components/InvestigationTerminal.tsx`.

## Run locally

1. Extract the ZIP.
2. Open a terminal in the folder containing `package.json`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

## Prototype limitations

This is a frontend-only prototype. The correct flag and dataset are bundled in client-side source, so this is not secure against a player who inspects the bundle. Saved evidence and solved state use browser local storage. For a public/competitive release, validate flags and store completion server-side.
