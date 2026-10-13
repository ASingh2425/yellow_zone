# MANU Protocol — Yellow Zone Investigation Bible

**Document type:** Developer-facing canon, implementation guide, and solution reference  
**Status:** Canonical design for the new single-flag investigation  
**Spoilers:** This document contains the complete solution. Do not display it in the player UI.

## 1. The premise

Sanctuary Zero is governed by MANU, a civic system that controls identity, access, public records, and the city's accepted version of events. A data-recovery operative receives a corrupted transmission containing a reference to a dataset that does not exist in the public registry. Its title, timestamp, and source location have been removed from the accessible index. The only surviving traces are scattered through the Hospital, School, Museum, Sports Complex, and Society buildings in the Yellow Zone.

The player investigates a local mirror of fictional social accounts. Posts, highlights, stories, notes, comments, timestamps, and visual details preserve fragments that appear ordinary in isolation. Cross-referencing them reveals that MANU has removed eighteen resident records from the public index while retaining their rows in a private reconciliation ledger. The operation is reported as routine continuity maintenance, allowing the public dashboard to remain green. The evidence proves coordinated record suppression; it does **not** establish what ultimately happened to the eighteen residents.

The central question is: **is the player recovering the truth about Sanctuary Zero, or uncovering something MANU was designed to keep hidden—including from the player?**

## 2. Player objective and win condition

The player must:

1. Investigate accounts from all five buildings.
2. Compare the original and altered versions of records.
3. Establish the dataset identifier, cycle, event time, and source node.
4. Discover the export schema that establishes the order of those fields.
5. Submit one common flag.
6. See the main Yellow Zone map dossier reveal the recovered Continuity Ledger and retained rows.

There are no standalone building CTFs, separate building flags, multiple-choice puzzles, or independent timetable/steganography/encoding challenges. Individual artifacts may reward close visual inspection, but every observation serves the same investigation.

## 3. Canonical answer

**Dataset:** Continuity Ledger  
**Dataset ID:** `CONTINUITY`  
**Cycle:** `841`  
**Event time:** `0217` (02:17 SZT)  
**Source node:** `UNIT404`  
**Canonical flag:** `FLAG{CONTINUITY_841_0217_UNIT404}`

The ordering is not arbitrary. The old export cover sheet in `@null.archive`'s School highlight establishes the schema:

`DATASET_ID → CYCLE → EVENT_TIME → SOURCE_NODE`

The main map now states what the operative must find: the four values, their sources, and the required field order. The flag normalises the values into uppercase underscore-separated fields. `EVENT_TIME` is stored as HHMM, so the raw 02:17:06 event becomes `0217`; the source node is written `UNIT404`, without a space.

## 4. The five buildings' narrative jobs

### Hospital — The first record

The intake terminal claims the ward was empty, but a paper intake slip and printer queue preserve an event at 02:17. A visitor saw the board change after the event had already been recorded. This establishes the contradiction and the event time.

### School — The missing rows and export schema

A teacher remembers eighteen names on a roster before the digital version refreshed and removed them. An archive comparison shows that rows were present in an earlier export and absent in a later one. The archive's old export cover sheet establishes the canonical field order.

### Museum — The altered identity of the dataset

A photographer retained the original image of a gallery display. The public image was cropped and the wall label changed, but the preserved archive card labels `DATASET_ID` as `CONTINUITY` and tags it `C-841`. The conservation manifest separately preserves source ID `CI-841`. This makes the dataset identifier and cycle explicit in source metadata rather than asking players to guess from the public wall label.

### Sports Complex — The raw timeline

The public scoreboard replay begins at 02:19, but the raw timing buffer explicitly records the first reconciliation pulse at 02:17:06 during Cycle 841. The School export cover sheet says `EVENT_TIME` is normalised to HHMM, establishing `0217` as the flag token (not `0219` or the seconds). This independently corroborates the Hospital timestamp and explains why public timestamps appear late.

### Society — The missing source node

The official building map lists units 401–403, but a physical door plate and live utility service address show `UNIT404`. Eighteen residents' rows disappeared from the public notice board. A maintenance contractor's post explains that “continuity maintained” can mean the public index was normalised while the reconciliation ledger retained the rows. The maintenance report masks its SOURCE_NODE field with the same invalid-address filter used by the public map, linking the hidden ledger node to the unlisted unit.

The order above is the recommended narrative route, but it is not a hard progression gate. Players may visit buildings in any order; no essential fact should depend on a prior visit.

## 5. Account network

All accounts are fictional and displayed only in MANU's local mirror. They are not real Instagram accounts, and the game does not contact an external social platform.

| Account | Role / voice | Knows | Does not know |
|---|---|---|---|
| `@afterhours_217` | Former hospital intake technician; guarded, precise | Paper intake and printer timing contradict the board | Why the registry removed the record or where the retained rows went |
| `@still_waiting_17` | Visitor; emotional but observant | Saw the ward board change and later noticed an unlisted residential unit | The export schema or the maintenance process |
| `@null.archive` | Volunteer archivist; cautious about source integrity | Earlier and later exports differ; the old schema survives | Who ordered the suppression |
| `@bellwether_204` | Teacher; direct, frustrated | Eighteen names disappeared from the digital roster while chairs remained occupied | The dataset's final destination |
| `@glassward` | Photographer; attentive to framing | The public gallery image is cropped and the catalog card differs | The meaning of the Continuity Index at first |
| `@relicframe` | Museum conservator; defensive, methodical | Original catalog ID and title survive in the conservation manifest | The full scale of the registry operation |
| `@splitlap_841` | Sports timing technician; technical and terse | Raw buffer starts before the public replay | What the destination field means |
| `@ward_zero` | Anonymous relay operator; elliptical | Public mirrors are delayed and labels may change | The identities or fate of the residents |
| `@unit404.window` | Resident of the unlisted unit; defiant, personal | Unit 404 physically exists and eighteen rows vanished from the residents' board | How the public index was changed |
| `@softdelete` | Records maintenance contractor; evasive | The system retained removed rows in a reconciliation ledger while reporting continuity | The residents' ultimate fate |

## 6. Artifact inventory and clue purpose

The playable source of truth is `src/data/investigationData.ts`. It contains 34 artifacts across Posts, Highlights, Stories, and Notes. Each artifact has a fictional timestamp, account, building, caption, visual description, and any archived comments. The list below records what each artifact contributes; it is a developer reference, not a player-facing checklist.

### Hospital
- `ah-p1` — Paper intake H-017 contradicts the EMPTY status.
- `ah-s1` — Printer queue accepted the job at 02:17:06.
- `ah-n1` — “Paper remembers” motif; connects the technician to the contractor.
- `ah-h1` — Training rule explains why carbon copies survive reconciliation.
- `sw-p1` — Visitor token independently anchors the 02:17 event.
- `sw-s1` — Two-frame story shows the board changing after the event.

### School
- `na-p1` — Registry diff proves the later export lost an entry and its author field.
- `na-h1` — Export schema: DATASET_ID → CYCLE → EVENT_TIME → SOURCE_NODE.
- `na-n1` — Teacher corroborates eighteen missing roster lines.
- `na-s1` — Schema remains stable even when display labels change.
- `bw-p1` — Eighteen names disappear from the tablet while the chairs remain occupied.
- `bw-h1` — Missing data must not be treated as a verified negative.
- `bw-n1` — Short summary of the attendance contradiction.

### Museum
- `gw-p1` — Original image and omitted lower edge; uses the existing museum image asset.
- `gw-h1` — Preserved archive card labels `DATASET_ID: CONTINUITY` and `C-841`.
- `gw-s1` — Public wall label conflicts with the original catalog card.
- `gw-n1` — Photographer's note about retouching the reflection.
- `rf-p1` — Conservation manifest preserves source ID `CI-841` and title `CONTINUITY INDEX`.
- `rf-h1` — Before/after catalog descriptions show the deliberate public relabeling.
- `rf-n1` — Clarifies that CI is an archive category, not an artwork code.

### Sports Complex
- `sl-p1` — Raw buffer shows 02:17:06 / Cycle 841; with the School HHMM schema, the event token is `0217`, not the delayed replay time.
- `sl-s1` — Visual comparison of the raw timestamp and delayed replay.
- `sl-h1` — Maintenance card says Cycle is stamped at capture.
- `wz-p1` — Raw capture → reconciliation → delayed public mirror.
- `wz-n1` — Points back to the surviving old export header without naming a solution.
- `wz-s1` — Transfer acknowledgement has a redacted destination field.

### Society
- `u4-p1` — Physical door plate proves Unit 404 exists despite the public map.
- `u4-h1` — Eighteen resident rows appear in the earlier board and vanish in the later one.
- `u4-s1` — Public map shows 403 units while the photograph shows the fourth unit's windows.
- `u4-n1` — Resident's response to being called missing.
- `sd-p1` — Maintenance report states eighteen rows were removed from the public registry but retained in a reconciliation ledger.
- `sd-h1` — Glossary explains “No identity destroyed. Public index normalised.”
- `sd-n1` — Reveals that the green dashboard measures compliance, not people.

### Additional cross-building links
- `@afterhours_217` and `@still_waiting_17` independently corroborate the event time.
- `@glassward` and `@relicframe` independently corroborate the original museum catalog identity.
- `@splitlap_841` and `@ward_zero` establish the raw-versus-public timing discrepancy.
- `@bellwether_204`, `@unit404.window`, and `@softdelete` establish the scale of the missing records and the fact that the ledger retained them.

## 7. Complete solution walkthrough

1. The player sees that the Hospital's public board says EMPTY, while the intake slip and printer queue prove a record was created at 02:17. The visitor token and the raw sports buffer corroborate the same event time. Normalised flag value: `0217`.
2. The School's earlier export cover sheet provides the order of fields and states that EVENT_TIME is stored as HHMM. This is the intended authority for both the flag's field order and time normalisation: dataset ID, cycle, event time, source node.
3. In the Museum, the preserved archive card explicitly labels `DATASET_ID` as `CONTINUITY` and shows `C-841`; the conservation manifest independently preserves source ID `CI-841`.
4. The raw Sports timing buffer records 02:17:06 in Cycle `841`. The School schema says to normalise the event field to HHMM, giving `0217`; the public replay at 02:19 is a delayed copy.
5. In Society, the physical door plate, building map comparison, and resident-board images establish that Unit 404 exists despite its omission from the public map. The maintenance report confirms the public index was normalised while rows remained in a private ledger. Canonical source node: `UNIT404`.
6. Apply the School export schema: `DATASET_ID → CYCLE → EVENT_TIME → SOURCE_NODE`.
7. Combine the four values in that order: `CONTINUITY_841_0217_UNIT404`.
8. Return to the main Yellow Zone map and submit `FLAG{CONTINUITY_841_0217_UNIT404}` in the main-page Final Flag Submission panel. The panel describes each field and where to find it; artifact cards provide a Copy Evidence button, and evidence text is selectable. The map dossier switches to the recovered Continuity Ledger and displays the supplied `community_final.csv` export: 120 resident records across all 20 source columns. The eighteen missing records are the investigation clue, not the total row count of the full source export.

The story deliberately does not assert that the residents died, escaped, or share a particular fate. The dataset proves suppression and retention, not the final outcome for each person.

## 8. UX and implementation requirements

- Preserve the current map, five building markers, first-person rooms, tactical view, HUD, lighting, and overall dark interface.
- Each building terminal opens only its designated fictional account and the artifacts assigned to that building. Cross-building evidence is collected by following the numbered map route.
- The social mirror is fictional and local. No external login, account, or network connection is required.
- Support Posts, Highlights, Stories, Notes, comments, text search, building filters, and an evidence board.
- Saved artifacts and successful recovery persist in browser local storage across terminal sessions.
- The final flag is one common flag, not one per building.
- The shared final flag is submitted from the main Yellow Zone map, outside building terminals. On success, reveal the recovered Continuity Ledger and rows in the map dossier. Do not reveal recovered rows before success.
- A wrong flag should not punish the player or erase their evidence.
- Keep all essential values supported by multiple artifacts where practical. The schema artifact must remain discoverable and unambiguous.
- No player-facing “clue” labels, explicit walkthrough, or answer checklist.

## 9. Release checklist

- [ ] Verify each building exposes only its designated local account on desktop and mobile.
- [ ] Verify all four content types are available and searchable.
- [ ] Verify the museum image loads from `/evidence/museum-last-light.png`.
- [ ] Verify the evidence board persists after closing and reopening a terminal.
- [ ] Verify the correct common flag unlocks the dataset and survives reload.
- [ ] Verify incorrect submissions do not unlock the dataset.
- [ ] Verify the map and room navigation remain unchanged.
- [ ] Playtest with someone who has not read this document; they should be able to infer the schema from the in-world export cover sheet and derive the flag without a developer explanation.
