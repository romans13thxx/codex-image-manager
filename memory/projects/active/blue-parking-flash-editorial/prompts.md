# Reusable Prompts

Use the permanent style module:

- `memory/permanent/style-library/real-human/outdoor-street.md`

## Variable Slots

- `{pose_slot}`: pole lean, salute lean, curb sit, cart recline, selfie wink, kneeling street pose, backlit canopy kneel
- `{anchor_prop}`: striped pole, metal column, shopping cart, curb edge, smartphone, newspaper, canopy frame
- `{camera_slot}`: vertical 24mm high-angle full body, vertical 35mm medium shot, tight 50mm selfie close-up, low-front curb portrait
- `{light_slot}`: hard midday sun plus direct fill flash, backlit sun flare plus fill flash, side sun with crisp shadows
- `{background_slot}`: blue painted parking bay, generic blue/yellow retail wall, loading lane with arrows, cart bay, canopy walkway

## Set Prompts

### 01 Pole Lean

```text
Adult female fashion model, 22+, long peach-blonde loose waves, glossy lips, clear eyes, soft shimmer makeup, dusty-blue ribbed strapless crop top, beige utility shorts, pale blue belt, chunky white sneakers, slouchy white leg warmers, stacked bracelets and rings. Generic outdoor big-box retail parking lot, blue painted ground, grey concrete, black-yellow striped pole, weathered metal column and canopy beams, parked cars and planters in the distance, no readable brand text. Pose: pole lean, one arm overhead across hair, one hand holding wrist, S-curve torso, direct calm gaze. Camera: vertical 24mm high-angle full body, strong diagonals from canopy beams and parking stripes. Lighting: hard midday sun plus direct fill flash, crisp shadows, point-and-shoot fashion editorial realism. Avoid real logos, readable text, watermarks, search UI, hashtags, distorted hands/faces, childlike or teen-coded appearance, extra limbs, plastic skin.
```

### 02 Salute Lean

```text
Adult female fashion model, 22+, peach-blonde wavy hair, blue ribbed strapless crop top, beige utility shorts, pale blue belt, chunky white sneakers, slouchy white socks, silver bracelets and rings. Generic retail parking service lane with blue painted floor, curb drain, striped safety pole, parked cars and greenery, no brand text. Pose: one hand shields forehead from sun like a salute, other arm reaches to a pole, hip angled, one knee forward, playful direct gaze. Camera: vertical 24mm high-angle medium-full body, blue floor fills foreground, parking lane diagonals lead to face. Lighting: hard sun and fill flash, crisp shadows, candid compact-camera snapshot. Avoid logos, readable text, watermark, UI overlay, distorted fingers, childlike look.
```

### 03 Curb Sit

```text
Adult female fashion model, 22+, rose-gold peach-blonde loose waves, glossy makeup, dusty-blue ribbed tube top, beige shorts, pale blue belt, chunky white sneakers and thick slouchy leg warmers, charm bracelets. She sits on a curb near shopping carts in a generic blue/yellow retail loading area, cracked blue parking paint and rusted curb rail in foreground, abstract yellow block signage on blue wall but no readable words. Pose: knees pulled up toward camera, arms folded over knees, calm direct gaze, hair lifted slightly by wind. Camera: low-front vertical portrait, shoes large in foreground, face in upper third. Lighting: back/side hard sun plus fill flash, small lens flare, high-detail textures. Avoid real brand names, watermark, UI, extra fingers, deformed shoes, plastic skin.
```

### 04 Cart Recline

```text
Adult female fashion model, 22+, long peach-blonde waves, blue cropped tube top, beige utility shorts, blue belt, chunky white sneakers, white leg warmers, stacked bracelets and rings. She reclines inside a metal shopping cart in a generic outdoor retail parking lane, blue painted ground and white lane arrows, delivery truck and parked cars in distance, no readable brand or store logo. Prop: folded newspaper held above head as sun shade. Pose: legs extended toward camera, relaxed cart recline, one hand holding newspaper, direct gaze. Camera: vertical 24mm high-angle wide shot, cart rails create perspective lines, sneakers near foreground. Lighting: hard midday sun plus fill flash, crisp shadows. Avoid readable newspaper text, real logos, watermark, UI overlay, distorted cart geometry, extra limbs.
```

### 05 Selfie Wink

```text
Adult female fashion model, 22+, long peach-blonde loose waves, glossy lips, clear eyes, soft shimmer makeup, dusty-blue ribbed strapless crop top, charm necklace, rings and bracelets. Generic blue/yellow retail parking backdrop with abstract block signage and weathered metal column, no readable store name. Pose: tight selfie wink, one hand holds a smartphone close to the lens, other hand near cheek, gentle smile, face sharp and centered. Camera: vertical tight 35-50mm close-up, phone large in foreground edge, compact-camera flash realism. Lighting: direct flash on face with hard sun rim light, clean skin texture. Avoid logos, UI overlay, search box, hashtags, watermark, readable phone screen, distorted fingers, childlike appearance.
```

### 06 Backlit Canopy Kneel

```text
Adult female fashion model, 22+, peach-blonde wavy hair, blue crop tube top, beige shorts, pale blue belt, chunky white sneakers and slouchy white leg warmers, bracelets and rings. Generic outdoor retail walkway, metal canopy frame overhead, blue painted parking zone, black-yellow striped posts, abstract blue/yellow wall in background without readable brand text. Pose: kneeling on a folded newspaper, one hand on waist, one hand relaxed near thigh, calm direct gaze, torso angled in a soft S-curve. Camera: vertical medium-full body, canopy beams form strong diagonal leading lines. Lighting: backlit sun flare behind canopy plus fill flash on face, crisp shadow geometry. Avoid real logos, readable text, watermarks, UI overlays, distorted hands, extra limbs, plastic skin.
```

## Reusable Negative Prompt

```text
avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no real brand logo, no readable store name, no watermark, no search UI, no hashtags, no childlike or teen-coded appearance, no celebrity likeness, no plastic skin, no extra fingers, no extra limbs, no warped shopping cart, no deformed shoes, no unreadable cluttered signage
```
