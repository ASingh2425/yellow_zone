# MANU Protocol — Yellow Zone Missing Dataset RPG

MANU Protocol is a dark, exploratory, text-based investigation RPG set in Sanctuary Zero. The Yellow Zone's five buildings—Hospital, School, Museum, Sports Complex, and Society—are chapters in one mystery. The player pursues a missing dataset through a local mirror of fictional social-media accounts, comparing posts, highlights, stories, notes, comments, timestamps, and visual artifacts.

## Start the project

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Use the existing map to enter a building, then interact with its terminal to open the shared investigation network. No real Instagram account or external service is required.

## Main files

- `YELLOW_ZONE_STORY_BIBLE.md` — developer-only canonical story, account network, artifact inventory, full solution, and release checklist. Contains spoilers.
- `src/data/investigationData.ts` — all ten fictional accounts, 34 artifacts, recovered dataset, and canonical flag.
- `src/components/InvestigationTerminal.tsx` — shared terminal UI, account browser, evidence board, flag submission, and recovered dataset view.
- `src/data/protocolData.ts` — five buildings, map positions, visual themes, and room metadata.
- `src/components/ThreeRoomFPP.tsx` and `src/three/rooms/` — first-person room environments.

## Player loop

Explore a building → open the local social mirror → inspect and bookmark evidence → cross-reference artifacts from the other buildings → reconstruct the export signature → submit one common flag → recover the Continuity Ledger.

## Prototype notes

The story, posts, and accounts are fictional. No external social-media network is contacted. The final answer is currently checked client-side and is visible in bundled source, so move validation and completion state to a server before a public competitive release. Evidence bookmarks and successful recovery persist in local storage.
