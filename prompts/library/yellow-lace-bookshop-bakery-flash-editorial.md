# Yellow Lace Bookshop Bakery Flash Editorial

Long-term reusable prompt case for a fictional adult fashion model set inspired by the user-provided reference images.

## Analysis

- Main silhouette: adult model in lemon-yellow glossy lace-trim mini dress, rose-blonde waves, white platform knee boots.
- Scene grammar: bookshop mirror, red bakery window, brick street lamppost, cafe gate, brick doorway.
- Composition: vertical phone crop, subject large, face upper third, background grid or vertical anchor, body diagonal/S-curve.
- Light: direct compact-camera flash mixed with warm lamp, bakery glass, or hard street daylight.
- Props: open book, red hardcover book, silver chain bag, lamppost, gate, mirror, cafe furniture.
- Optional UI: search pill and yellow bottom tags only for screenshot mode.

## Style Stack

- `P007` disposable camera flash photo.
- `P008` paparazzi tabloid flash, low intensity.
- `F001` cyber gyaru street snap.
- `F010` 1990s Harajuku street snap magazine.
- `S002` Showa-era kissaten cafe interior.
- Optional `G008` Y2K techno magazine layout for screenshot UI.

## Reusable Prompt

```text
Adult female fashion model, 22+, fictional non-celebrity face, long rose-blonde loose wavy hair, clear eyes, glossy lips, soft shimmer makeup, bright lemon-yellow glossy lace-trim mini dress with opaque lining, thin straps, subtle rhinestones, lace hem, white platform knee boots, small silver metallic chain bag, pearl choker, layered delicate necklaces, silver bracelets, black bead bracelet, rings, long manicured nails.

Scene: {scene_slot}. Composition: {pose_slot}, subject anchored to {anchor_prop}, {camera_slot}, face near upper third, body forming a soft S-curve or diagonal, background geometry leads toward the face, compact-camera fashion street snap realism.

Lighting: {light_slot}, direct flash highlights on hair, dress, and boots, visible real-location texture, slight social app capture feeling.

Interface: {ui_slot}.

Avoid: avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no childlike or teen-coded appearance, no celebrity likeness, no real brand logo, no readable store name, no watermark, no transparent dress, no lingerie framing, no bedroom setting, no plastic skin, no extra fingers, no extra limbs, no warped books, no deformed boots, no fused bag chain.
```

## Variables

| Slot | Values |
| --- | --- |
| `{scene_slot}` | dark wood bookshop with mirror; red bakery window facade; brick street with black lamppost; cafe gate beside sidewalk; brick doorway with white trim |
| `{pose_slot}` | open-book turn; red-book front pose; hand-on-hair stand; bench boot-kick; lamppost kick; cafe gate lean; brick doorway kneel |
| `{anchor_prop}` | open book; red hardcover book; black lamppost; red window grid; silver chain bag; iron gate; mirror seam; white cafe table |
| `{camera_slot}` | vertical 24mm high-angle full body; vertical 35mm medium-full body; vertical 50mm waist-up portrait; low-front kneeling portrait |
| `{light_slot}` | direct compact-camera flash plus warm cafe lamp; direct flash through bakery glass; hard street daylight plus flash; shaded doorway plus fill flash |
| `{ui_slot}` | clean production image; subtle social screenshot overlay; translucent search capsule with `美式辣妹穿搭`; small bottom-left yellow pseudo hashtags |

## 2x2 Contact Sheet Prompt

```text
Create one 2x2 contact sheet of four vertical fashion photos, each panel a different scene from the same fictional adult model set. Adult female fashion model, 22+, fictional non-celebrity face, long rose-blonde loose waves, glossy lips, clear eyes, bright lemon-yellow glossy lace-trim mini dress with opaque lining, white platform knee boots, small silver chain bag, pearl and silver jewelry. Panel 1: dark wood bookshop mirror open-book turn. Panel 2: red bakery window hand-on-hair stand. Panel 3: brick street black lamppost boot-kick. Panel 4: cafe gate lean or brick doorway kneel with silver bag. Compact-camera flash realism, vertical phone editorial crops, consistent outfit and hair across panels, real location textures, subtle social app capture feeling. No real brand names, no readable menu or book titles, no watermark. Avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no childlike or teen-coded appearance, no celebrity likeness, no transparent dress, no lingerie framing, no extra fingers, no extra limbs, no deformed boots, no fused bag chain.
```
