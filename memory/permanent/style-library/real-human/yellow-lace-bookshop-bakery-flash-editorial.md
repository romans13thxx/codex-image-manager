# real-human / fashion-editorial: yellow lace bookshop bakery flash editorial

> Reusable style module for adult fashion-photo sets with yellow glossy lace styling, bookshop/bakery/street cafe locations, direct compact-camera flash, and social-app snapshot energy. This module describes a reusable visual pattern; do not copy any exact face, watermark, platform UI, or real brand from references.

## Core Look

- Category: `real-human`
- Subcategory: `fashion-editorial`
- Scene axis: `street-cafe-bookshop`
- Skin tone axis: `light`
- Appeal axis: `cute`
- Subject axis: `female`
- Base style: disposable camera flash fashion editorial, phone social snapshot, glossy street snap.
- Supporting style: cyber gyaru street snap, 1990s Harajuku street snap magazine, warm kissaten/cafe interior textures.
- Format: vertical phone photo series, mixed full-body, medium portrait, kneeling, prop, and storefront frames.

## Analysis Dimensions

- Composition: vertical 4:5 or 3:4, subject large in frame, face near upper third, body on diagonal or S-curve.
- Background: bookshop shelves and mirror, red bakery window grid, brick wall, black lamppost, iron cafe gate, white cafe furniture.
- Pose: one hand in hair, one hand on prop, one knee raised or boot kicked backward, torso twist toward camera.
- Props: open book, red hardcover book, silver chain bag, lamppost, cafe gate, window glass, mirror.
- Light: direct compact-camera flash plus warm ambient or daylight; flash highlights dress, hair, boots, and jewelry.
- Interface: optional screenshot layer with search capsule and bottom-left yellow tags; default clean output has no UI.

## Selected Style Logic

- `P007` disposable camera flash photo: main photographic surface.
- `P008` paparazzi tabloid flash: optional hard-flash accent, intensity below 0.45.
- `F001` cyber gyaru street snap: fashion attitude and social street-snap styling.
- `F010` 1990s Harajuku street snap magazine: magazine-like pose continuity.
- `S002` Showa-era kissaten cafe interior: warm cafe/bakery material layer.
- `G008` Y2K techno magazine layout: optional UI/interface layer, not default.

## Person Design

- Adult female model, 22+, fictional non-celebrity face.
- Slender fashion-doll-inspired proportions with natural adult anatomy.
- Long rose-blonde or pale peach-blonde loose wavy hair, voluminous crown.
- Large clear eyes, glossy lips, soft blush, pale shimmer makeup.
- Avoid childlike body proportions, teen-coded styling, exact face copying, celebrity likeness, plastic skin.

## Outfit And Props

- Bright lemon-yellow glossy lace-trim mini dress with opaque lining, thin straps, subtle rhinestones, lace hem.
- White platform knee boots with chunky sole.
- Small silver metallic chain bag.
- Pearl choker, layered delicate necklaces, silver bracelet stack, black bead bracelet, rings, long nails.
- Active props: open book, red hardcover book, black lamppost, red bakery window grid, iron gate, white cafe table, mirror seam.

## Pose Library

- Open-book turn: torso angled to shelves, one hand holding open book, head turned back to camera.
- Red-book front: red hardcover book held low, other hand near hair or shelf, mirror reflection behind.
- Hand-on-hair stand: one arm raised into hair, hip shift, direct gaze.
- Bench boot-kick: one knee bent backward, white boot crossing foreground, bag held low.
- Lamppost kick: hand on black pole, body leaning away, one boot lifted backward.
- Cafe gate lean: hand on gate, one knee raised, opposite hand near cheek.
- Brick doorway kneel: low kneel, one hand in hair, one hand presenting silver bag.

## Reusable Template

```text
Adult female fashion model, 22+, fictional non-celebrity face, long rose-blonde loose wavy hair, clear eyes, glossy lips, soft shimmer makeup, bright lemon-yellow glossy lace-trim mini dress with opaque lining, thin straps, lace hem, white platform knee boots, small silver metallic chain bag, pearl choker, layered delicate necklaces, silver bracelets, black bead bracelet, rings, long manicured nails.

Scene: {scene_slot}. Composition: {pose_slot}, subject anchored to {anchor_prop}, {camera_slot}, face near upper third, body forming a soft S-curve or diagonal, real background geometry leading toward the face, compact-camera fashion street snap realism.

Lighting: {light_slot}, direct flash highlights on hair, dress, jewelry, and boots, visible real-location texture, slight social app capture feeling.

Interface: clean production image by default; optional screenshot layer only when requested.

Avoid: avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no childlike or teen-coded appearance, no celebrity likeness, no real brand logo, no readable store name, no watermark, no search UI unless requested, no transparent dress, no lingerie framing, no bedroom setting, no plastic skin, no extra fingers, no extra limbs, no warped books, no deformed boots, no fused bag chain.
```

## Prompt Variants

### Bookshop Mirror

```text
Adult female fashion model, 22+, fictional non-celebrity face, long rose-blonde loose waves, yellow glossy lace-trim mini dress with opaque lining, white platform knee boots, pearl and silver jewelry. Dark wood bookshop aisle, dense shelves, mirror reflection, warm hanging lamp, no readable book titles. Pose: open-book turn, one hand holding an open book, torso angled to shelves, head turned back to camera. Direct compact-camera flash plus warm ambient light, vertical 35mm medium-full body, shelf lines lead to the face. Avoid distorted hands/faces, childlike appearance, celebrity likeness, readable titles, watermark, transparent dress.
```

### Red Bakery Window

```text
Adult female fashion model, 22+, fictional face, rose-blonde waves, yellow glossy lace-trim mini dress with opaque lining, white platform knee boots, silver chain bag, pearl and silver jewelry. Generic bakery storefront, deep red painted window grid, warm bulb, cafe interior behind glass, white hand-written pseudo menu marks with no readable brand. Pose: one hand in hair, hip shifted, calm direct gaze. Direct flash through glass, vertical 24mm full body. Avoid real logos, readable menu text, watermark, teen-coded appearance, transparent dress.
```

### Street Lamppost

```text
Adult female fashion model, 22+, fictional non-celebrity face, long rose-blonde hair, yellow glossy lace mini dress with opaque lining, white platform knee boots, silver chain bag, bracelets and rings. Brick urban street facade, black glossy lamppost, iron railing, sidewalk edge, no readable signage. Pose: one hand holding lamppost, body leaning away, one leg lifted backward, face tilted toward lens. Hard street daylight plus direct fill flash, vertical 24mm high-angle full body. Avoid warped boot sole, extra limbs, distorted fingers, watermark, random text.
```

### Brick Doorway Kneel

```text
Adult female fashion model, 22+, fictional face, rose-blonde loose waves, yellow glossy lace-trim mini dress with opaque lining, white platform knee boots, silver chain bag, pearl choker, layered necklaces. Brick cafe doorway, white door trim, concrete floor, high white cafe table, no readable signage. Pose: low kneeling pose, one hand in hair, other hand presenting the silver bag. Compact-camera direct flash, low-front vertical medium-full portrait, brick texture framing the face. Avoid fused bag chain, distorted knees or hands, childlike look, transparent dress, watermark.
```

## Negative Constraints

avoid generic modern minimalism, avoid random extra text, avoid messy symbols, avoid distorted hands/faces, avoid losing subject identity, no childlike or teen-coded appearance, no celebrity likeness, no real brand logo, no readable store name, no readable book title, no readable bakery menu, no watermark, no social UI unless requested, no transparent dress, no lingerie framing, no bedroom setting, no plastic skin, no extra fingers, no extra limbs, no warped books, no deformed boots, no fused bag chain
