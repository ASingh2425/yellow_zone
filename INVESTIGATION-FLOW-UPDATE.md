# Investigation Flow UI Update

- The terminal shows the recommended numbered route: 01 Hospital, 02 School, 03 Museum, 04 Sports Complex, 05 Society.
- The active building is highlighted in the terminal route tracker.
- The main-map dossier contains five cinematic chapter thumbnails and short narrative summaries, alongside the single shared final-flag input.
- On smaller screens, the story route expands from a compact map overlay while the final-flag input remains visible on the map.
- The shared final flag input now lives on the main Yellow Zone map. A successful submission reveals the Continuity Ledger there; building terminals are for evidence browsing only.
- The mission briefing explains why the operative is investigating a dataset that the public registry denies exists.
- Each building now has a player-facing chapter file: incident narrative, why the node matters, inbound trace, handoff to the next node, and chapter objective.
- The map-side Trace Network contains a short premise and a one-line narrative purpose for each stop, sorted in numbered route order.
- The intended story handoffs are Hospital → School → Museum → Sports Complex → Society. The UI provides narrative guidance but does not hard-lock building movement.
- The accounts remain fictional local mirrors, with one designated account per building.

- The main-map flag panel now includes a “Your Objective” guide describing the four fields, where their evidence lives, the School export field order, and HHMM time normalisation.
- Museum archive card explicitly identifies `DATASET_ID: CONTINUITY` and the `C-841` cycle tag; Sports raw timing explicitly shows `02:17:06 / CYCLE 841` and explains why the recovery time token is `0217`, not the delayed `02:19` replay.
- Evidence cards include a Copy Evidence control that copies the account, archive ID, timestamp, artifact label/details, caption, and comments. Global text selection is enabled.

- The recovered dossier now renders the supplied `community_final.csv` (120 resident rows × 20 columns), supports search across all fields, and provides a download link to the original CSV. The previous fabricated 18-row × 4-column placeholder table was removed.
