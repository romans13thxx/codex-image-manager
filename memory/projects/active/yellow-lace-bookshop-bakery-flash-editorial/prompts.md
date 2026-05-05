# Reusable Prompts

Use the permanent style module:

- `memory/permanent/style-library/real-human/yellow-lace-bookshop-bakery-flash-editorial.md`

## Variable Slots

- `{scene_slot}`: dark wood bookshop with mirror, red bakery window facade, brick street with black lamppost, cafe gate beside sidewalk, brick doorway with white trim
- `{pose_slot}`: open-book turn, red-book front pose, hand-on-hair stand, bench boot-kick, lamppost kick, cafe gate lean, brick doorway kneel
- `{anchor_prop}`: open book, red hardcover book, black lamppost, red window grid, silver chain bag, iron gate, mirror seam, white cafe table
- `{camera_slot}`: vertical 24mm high-angle full body, vertical 35mm medium-full body, vertical 50mm waist-up portrait, low-front kneeling portrait
- `{light_slot}`: direct compact-camera flash plus warm cafe lamp, direct flash through bakery glass, hard street daylight plus flash, shaded doorway plus fill flash
- `{ui_slot}`: clean production image, subtle social screenshot overlay, translucent search capsule with `美式辣妹穿搭`, small bottom-left yellow pseudo hashtags

## Master Template

```text
Adult female fashion model, 22+, fictional non-celebrity face, long rose-blonde loose wavy hair, clear eyes, glossy lips, soft shimmer makeup, bright lemon-yellow glossy lace-trim mini dress with opaque lining, thin straps, subtle rhinestones, lace hem, white platform knee boots, silver metallic mini chain bag, pearl choker, layered delicate necklaces, silver bracelets, black bead bracelet, rings, long manicured nails.

Scene: {scene_slot}. Composition: {pose_slot}, subject anchored to {anchor_prop}, {camera_slot}, face near upper third, body forming a soft S-curve or diagonal, background geometry leads toward the face, compact-camera fashion street snap realism.

Lighting: {light_slot}, crisp on-camera flash highlights on hair, dress, and boots, real location texture visible, slight social app capture feeling.

Interface: {ui_slot}. Keep UI away from face and hands if enabled.

Avoid: avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no childlike or teen-coded appearance, no celebrity likeness, no real brand logo, no readable store name, no watermark, no transparent dress, no lingerie framing, no bedroom setting, no plastic skin, no extra fingers, no extra limbs, no warped books, no deformed boots, no fused bag chain.
```

## Set Prompts

### 01 Bookshop Mirror Open Book

```text
Adult female fashion model, 22+, fictional non-celebrity face, long rose-blonde loose waves, clear eyes, glossy lips, soft shimmer makeup. Bright lemon-yellow glossy lace-trim mini dress with opaque lining, thin straps, lace hem, white platform knee boots, pearl choker, silver bracelets, rings, long manicured nails. Dark wood bookshop or library aisle, dense book spines, mirror panel behind her creating a partial reflection, warm hanging lamp, no readable book titles. Pose: open-book turn, one hand holding an open book at chest height, torso angled toward shelves, head turned back to camera, hair over one shoulder. Camera: vertical 35mm medium-full body, face near upper third, shelf lines and mirror seam lead toward the face. Lighting: direct compact-camera flash plus warm lamp glow, crisp highlights on yellow fabric and hair. Clean production image, no UI. Avoid distorted hands/faces, childlike appearance, celebrity likeness, readable titles, watermark, transparent dress, extra fingers, fused book pages, deformed boots.
```

### 02 Bakery Window Hand On Hair

```text
Adult female fashion model, 22+, fictional face, rose-blonde voluminous waves, glossy lips, pale shimmer makeup, lemon-yellow glossy lace mini dress with opaque lining, white platform knee boots, silver chain bag, pearl and silver jewelry. Generic bakery storefront with deep red painted window grid, warm hanging bulb, cafe interior behind glass, hand-written white menu marks as pseudo text only, no readable brand. Pose: one hand lifted into hair, other arm relaxed near thigh, hip shifted, calm direct gaze. Camera: vertical 24mm full body, red window mullions form a grid around the subject, feet and boots visible. Lighting: direct flash through bakery glass plus warm interior lamp, crisp social street snap. Optional subtle centered translucent play triangle only if screenshot mode is needed. Avoid real logos, readable menu text, watermark, search UI unless requested, distorted hands, teen-coded appearance, transparent dress.
```

### 03 Street Lamppost Boot Kick

```text
Adult female fashion model, 22+, fictional non-celebrity face, long pale rose-blonde waves, glossy makeup, yellow glossy lace-trim mini dress with opaque lining, white chunky platform knee boots, small silver chain shoulder bag, bracelets and rings. Brick urban street facade, black glossy lamppost in foreground, iron railing, sidewalk edge, muted apartment windows, no readable signage. Pose: one hand holding the lamppost, torso leaning away from pole, one leg lifted backward so the white boot crosses the lower foreground, face tilted toward camera. Camera: vertical 24mm high-angle full body, lamppost creates a strong black vertical anchor, brick courses and street edge form background geometry. Lighting: hard street daylight plus direct fill flash, crisp shadow edges. Clean production image. Avoid distorted fingers, warped boot sole, extra limbs, celebrity likeness, childlike look, watermark, random text.
```

### 04 Cafe Gate Lean

```text
Adult female fashion model, 22+, fictional face, long rose-blonde wavy hair, glossy lips, soft blush, lemon-yellow lace-trim glossy mini dress with opaque lining, white platform knee boots, silver metallic mini chain bag, pearl choker, silver bracelets and rings. Small street cafe entrance, black iron gate, white outdoor cafe chair and table, tiled threshold, leafy sidewalk and soft city background, no readable signs. Pose: one hand resting on gate, one knee raised with boot visible, opposite hand near cheek, shoulders tilted, body in a soft S-curve, calm direct gaze. Camera: vertical 35mm full body, gate rails and sidewalk lines lead toward the face. Lighting: shaded doorway plus direct flash, natural daylight in background. Optional subtle social screenshot search capsule with `美式辣妹穿搭` only if requested. Avoid UI covering face, distorted hands, deformed gate, childlike appearance, transparent dress, watermark.
```

### 05 Brick Doorway Kneel With Silver Bag

```text
Adult female fashion model, 22+, fictional non-celebrity face, long rose-blonde loose waves, clear eyes, glossy lips, soft shimmer makeup, yellow glossy lace-trim mini dress with opaque lining, white platform knee boots, pearl choker, layered necklaces, bracelets and rings. Brick cafe doorway with white door trim, concrete floor, high white cafe table, small ground lights, no readable signage. Pose: low kneeling pose, one knee raised, one hand placed in hair, other hand presenting a small silver chain bag, boot sole visible but natural. Camera: low-front vertical medium-full portrait, face centered upper third, brick wall texture frames subject. Lighting: compact-camera direct flash with soft ambient doorway light, high detail fabric and jewelry. Clean production image. Avoid distorted knees/hands, fused bag chain, extra fingers, teen-coded styling, transparent dress, watermark, random text.
```

### 06 Bookshop Red Book Front Pose

```text
Adult female fashion model, 22+, fictional face, long rose-blonde loose waves, glossy lips, clear eyes, lemon-yellow glossy lace-trim mini dress with opaque lining, pearl choker, layered necklaces, silver bracelets, rings, long manicured nails. Dark wood bookshop aisle with dense shelves and mirror reflection behind, warm lamp highlight, no readable book titles. Pose: front-facing red-book pose, holding a red hardcover book low at waist with one hand, other hand lifted near hair and bookshelf, direct calm gaze. Camera: vertical 35mm medium portrait, subject fills frame, mirror doubles the yellow dress silhouette in the background. Lighting: direct disposable-camera flash plus warm bookshop ambient light, crisp highlights and slight flash falloff. Optional small social app bottom-left yellow pseudo hashtags only in screenshot mode. Avoid readable text, watermark, distorted hands, copied face, childlike look, transparent dress, plastic skin.
```

## 2x2 Set Contact Sheet Prompt

```text
Create one 2x2 contact sheet of four vertical fashion photos, each panel a different scene from the same fictional adult model set. Adult female fashion model, 22+, fictional non-celebrity face, long rose-blonde loose waves, glossy lips, clear eyes, bright lemon-yellow glossy lace-trim mini dress with opaque lining, white platform knee boots, small silver chain bag, pearl and silver jewelry. Panel 1: dark wood bookshop mirror open-book turn. Panel 2: red bakery window hand-on-hair stand. Panel 3: brick street black lamppost boot-kick. Panel 4: cafe gate lean or brick doorway kneel with silver bag. Compact-camera flash realism, vertical phone editorial crops, consistent outfit and hair across panels, real location textures, subtle social app capture feeling. No real brand names, no readable menu or book titles, no watermark. Avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no childlike or teen-coded appearance, no celebrity likeness, no transparent dress, no lingerie framing, no extra fingers, no extra limbs, no deformed boots, no fused bag chain.
```

## Reusable Negative Prompt

```text
avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no childlike or teen-coded appearance, no celebrity likeness, no real brand logo, no readable store name, no readable book title, no readable bakery menu, no watermark, no social UI unless requested, no transparent dress, no lingerie framing, no bedroom setting, no plastic skin, no extra fingers, no extra limbs, no warped books, no deformed boots, no fused bag chain, no over-cluttered jewelry
```
