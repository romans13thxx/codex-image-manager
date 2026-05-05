# real-human / fashion-editorial: sunlit glass corridor campus editorial

> Reusable style module. Use for adult fashion-photo sets inside a modern glass corridor, library lobby, museum passage, transit hall, or campus-like public interior. This captures composition, light, outfit logic, props, pose families, and optional screenshot UI treatment from the reference set without copying a specific face, watermark, or platform interface.

## Core Look

- Category: `real-human`
- Subcategory: `fashion-editorial`
- Scene axis: `indoor-home` in current taxonomy; actual scene is a public sunlit glass corridor or campus lobby.
- Skin tone axis: `light`
- Appeal axis: `cute`
- Subject axis: `female`
- Base style: dreamy real-human fashion editorial, compact-camera vertical phone frame, glass corridor daylight portrait.
- Supporting styles from `rare-style-explorer`: `P010 cross-processed slide film, lomo colors`; `P025 film light leak`; `M009 frosted acrylic, translucent plastic` for optional UI overlay; `D019 early smartphone camera UI` only for screenshot mode.
- Format: 9:16 vertical image set with continuous pose variation, phone screenshot crop, high bloom, soft haze, strong geometry.

## Composition Principles

- Use the window grid as the main frame: black mullions, repeated rectangles, vertical columns, horizontal window rails, and diagonal shadows.
- Put the subject in the lower-right or lower-middle third, leaving sky/window negative space above.
- Let hard sunlight create a second silhouette: shadow on a white vending-machine block, wall, pillar, or glossy floor.
- Use high-contrast geometry: glass frames, floor tile seams, ceiling beams, yellow wall panels, and a white monolith should create depth lines toward the subject.
- Keep the camera slightly wide and close enough for full-body or three-quarter fashion poses; avoid flat straight-on studio framing.
- Preserve a candid screenshot feeling: slight overexposure, mild blur in highlights, reflected floor, outdoor greenery visible through glass.
- Use one anchor prop per frame: window rail, white vending-machine block, quilted backpack, shoulder bag, floor outlet, glass latch, yellow wall.

## Background Rules

- Modern public interior with floor-to-ceiling glass, black metal mullions, glossy pale floor, ceiling slats, and hard afternoon sunlight.
- Outdoor view should show green trees, hill, grass, road, or white campus building, softly defocused through glass.
- Color palette: aqua glass, green exterior, warm cream sunlight, beige plaid, white top, black shoes, optional yellow architectural panel.
- Keep the space clean but real: reflections, small fixtures, outlets, window handles, vending-machine edges, and subtle floor scuffs.
- Avoid generic studio, hotel lobby glamour, bedroom, nightclub, readable brand signage, and fake luxury retail background.

## Person Design

- Adult female model, clearly 22+; fashion editorial styling, not schoolgirl or teen-coded.
- Slender adult fashion proportions, natural anatomy, readable hands and face.
- Hair: long rose-gold, peach-blonde, or soft copper hair, slightly wind-touched, catching sunlight.
- Face: clear eyes, soft blush, glossy lips, gentle expression; do not copy any specific real person or reference identity.
- Outfit: ivory fitted short-sleeve or sleeveless knit top with modest neckline, beige plaid pleated fashion skirt, black leather belt.
- Shoes: chunky black platform Mary Jane, derby, or loafer shoes; white crew socks.
- Accessories: stacked bracelets, thin necklace, small rings, optional hair clip.
- Props: white quilted backpack, white shoulder bag, window latch, vending-machine-like white block, floor outlet, folded receipt/ticket.

## Pose Library

- Vending block lean: back against white block, arms loosely crossed, one knee bent and foot lifted, face turned into sunlight, strong cast shadow behind.
- Sun stretch lean: shoulders against block or wall, head dropped slightly, one leg extended diagonally, one hand at belt or skirt edge.
- Corridor walk spin: side profile in motion, one knee bent back, skirt flaring, hair flowing, hand carrying white quilted shoulder bag.
- Window crouch: low squat near glass, one hand near chin or lips, other hand relaxed toward floor, backpack visible, gaze toward camera.
- Window touch turn: standing close to glass, both hands near window rail or latch, torso turned back toward camera, backpack visible.
- Glass rail pause: one elbow or fingertips on rail, body in three-quarter view, eyes looking through window, long hair rim-lit.

## Camera And Light

- Vertical 9:16, compact-camera or phone screenshot crop.
- 24-35mm equivalent for full-body; 35-50mm for half-body and window touch poses.
- Slight low angle for full-body lean; eye-level or slightly high angle for crouch.
- Hard direct afternoon sun through glass, overexposed highlights on hair and face, soft bloom, low-to-medium contrast shadows.
- Glossy floor reflections should be visible but not mirror-perfect.
- Film feel: light leak, cross-processed green/cyan highlights, warm cream sun patches, controlled grain.

## Optional Interface Layer

Use only for screenshot-mode outputs:

- Top-left frosted translucent search pill, magnifier icon, no long readable text.
- Small bottom-left frosted tag or caption stub, cropped by frame edge.
- Keep interface at low opacity so it does not cover the face or body.
- Default production prompts should disable readable UI, watermarks, usernames, hashtags, and platform chrome.

## Negative Constraints

avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no minors, no childlike body, no school uniform wording, no celebrity likeness, no watermark, no readable social app UI, no brand logo, no duplicated limbs, no broken fingers, no deformed shoes, no plastic skin, no extreme sexualized pose, no messy plaid, no unreadable fake signage on the subject, no face hidden by UI overlay

## Reusable Template

```text
Adult female fashion model, clearly 22+, long rose-gold peach-blonde hair catching sunlight, glossy lips, soft blush, clear eyes, ivory fitted knit top, beige plaid pleated fashion skirt, black leather belt, chunky black platform loafers, white crew socks, stacked bracelets, thin necklace.

Scene: modern public glass corridor or campus lobby, floor-to-ceiling glass windows with black metal mullions, glossy pale floor, outdoor trees and road visible through glass, warm hard afternoon sunlight, aqua glass reflections, optional white vending-machine block or yellow architectural panel.

Composition: {pose_slot}, subject placed in lower-right or lower-middle third, strong window-grid geometry, long hard sunlight patches, clear cast shadow, reflective floor, vertical 9:16 compact-camera screenshot crop, candid fashion editorial realism.

Lighting: direct afternoon sun through glass, slight overexposure, soft bloom, cross-processed slide-film color, subtle film light leak, controlled grain, high detail, clear face, expressive pose, 1-2 key accessories only.

Optional screenshot layer: faint frosted acrylic search pill in the top-left and small bottom-left tag stub, no readable platform text, no watermark.

Avoid: no minors, no school uniform, no celebrity likeness, no readable UI text, no watermark, no brand logos, no distorted hands/faces, no extra limbs, no deformed shoes, no plastic skin, no random symbols, no face covered by overlay.
```

