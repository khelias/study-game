# LAUSE-DETEKTIIV (Sentence Detective) - Requirements Documentation

## Game Overview
Educational game for Estonian children (ages 6-8) that teaches spatial prepositions by matching Estonian sentences to visual representations of spatial relationships.

## Core Functionality

### 1. Problem Generation (Generator Logic)

#### Input
- `level`: number (1-15)
- `rng`: Random number generator function
- `profile`: 'starter' | 'advanced'

#### Process
1. **Scene Selection** (based on level progression):
   - Level 1-2: Simple scenes (3-4 position types) - e.g., `forest`, `space`
   - Level 3-5: Medium scenes (4-5 position types) - e.g., `room`, `park`, `beach`
   - Level 6+: All scenes available

2. **Object Selection**:
   - Randomly select one `subject` (movable object) from scene's subjects
   - Randomly select one `anchor` (stationary object) from scene's anchors
   - Both must come from the same scene

3. **Position Selection**:
   - Randomly select one valid position from scene's available positions
   - This becomes the `correctPos` (correct answer)

4. **Option Generation**:
   - **Correct option**: Same subject + same anchor + correct position
   - **Wrong options**: Same subject + same anchor + different positions
   - Number of options based on level:
     - Level 1: 2 options (1 correct + 1 wrong)
     - Level 2+: 3 options (1 correct + 2 wrong)
     - Level 3+: 4 options (1 correct + 3 wrong)
     - Level 4+: Up to 5 options if enough positions available

5. **Sentence Generation**:
   - Format: `{SUBJECT} ON {ANCHOR_FORM} {POSITION_TEXT}.`
   - Example: `RAKETT ON PLANEEDI EES.` (Rocket is in front of planet)
   - **Estonian Grammar Rules**:
     - For `INSIDE`: Use inessive case (`PUUS`, `KARBIS`)
     - For `ON`, `UNDER`, `NEXT_TO`, `IN_FRONT`, `BEHIND`: Use genitive case (`PUU`, `PLANEEDI`)
     - Position translations:
       - `NEXT_TO` → `kõrval`
       - `ON` → `peal`
       - `UNDER` → `all`
       - `IN_FRONT` → `ees`
       - `BEHIND` → `taga`
       - `INSIDE` → `sees`

#### Output
```typescript
{
  type: 'sentence_logic',
  scene: string,              // Scene key (e.g., 'space', 'forest')
  sceneName: string,          // Estonian scene name (e.g., 'Kosmos', 'Mets')
  subject: SceneSubject,     // { n: 'RAKETT', e: '🚀' }
  anchor: SceneAnchor,        // { n: 'PLANEET', genitive: 'PLANEEDI', e: '🪐', ... }
  position: string,          // Correct position (e.g., 'IN_FRONT')
  caseType: 'adess' | 'iness',
  sentence: string,          // Generated Estonian sentence
  display: string,           // Same as sentence (for UI)
  options: Array<Option>,    // Visual options with position data
  answer: 'correct',        // Always 'correct' (identifier for correct option)
  uid: string               // Unique problem ID
}
```

### 2. Visual Rendering (UI Component)

#### Visual Requirements for Each Position

1. **NEXT_TO** (`kõrval`):
   - Two objects side-by-side horizontally
   - Equal visual weight, no overlap
   - Use flexbox layout for true side-by-side positioning
   - Subject can be left or right (random per option)

2. **ON** (`peal`):
   - Subject positioned above anchor
   - Subject slightly larger (1.2x scale)
   - Clear vertical separation (subject at 25% top, anchor at 75% top)
   - Subject has higher z-index

3. **UNDER** (`all`):
   - Subject positioned below anchor
   - Anchor larger (1.2x scale) and above (25% top)
   - Subject smaller (0.75x scale) and below (75% top)
   - Anchor has higher z-index (visually covers subject)

4. **IN_FRONT** (`ees`):
   - **CRITICAL**: Subject must overlap and partially cover anchor
   - Subject larger (1.5x scale) - appears closer
   - Anchor smaller (0.9x scale) - appears further
   - Both centered but offset to create overlap
   - Subject has higher z-index (in front)
   - Visual depth effect through size difference + overlap

5. **BEHIND** (`taga`):
   - **CRITICAL**: Anchor must overlap and partially cover subject
   - Anchor larger (1.4x scale) - appears closer/in front
   - Subject smaller (0.7x scale, 40% opacity) - appears behind
   - Both centered but offset to create overlap
   - Anchor has higher z-index (in front)
   - Visual depth effect through size difference + overlap + opacity

6. **INSIDE** (`sees`):
   - Subject small (0.35x scale) and centered
   - Anchor large (1.5x scale) and centered
   - Subject appears inside anchor
   - Subject has higher z-index (visible inside)

#### Visual Container
- Background: Scene-specific gradient (from `scene.bg`)
- Size: `h-32 sm:h-44` (responsive)
- Border: Rounded corners, subtle shadow
- Hover effects: Scale up slightly, shadow enhancement

#### Option Grid Layout
- 2 options: `grid-cols-2`
- 3 options: `grid-cols-3` (or `grid-cols-2` with one spanning)
- 4 options: `grid-cols-2` (2x2 grid)
- 5 options: `grid-cols-3` (with appropriate spanning)

### 3. User Interaction

#### Selection
- User clicks on one of the visual option cards
- Visual feedback:
  - Correct: Celebration animation, proceed to next problem
  - Wrong: Option disabled (grayed out), show feedback message, allow retry

#### Answer Validation
- Compare selected option's `text` property with `problem.answer`
- `problem.answer` is always `'correct'`
- Correct option has `answer: true` in its option object

### 4. Data Structures

#### Scene Data
```typescript
{
  bg: string,                    // Tailwind gradient classes
  name: string,                   // Estonian name
  subjects: SceneSubject[],       // Movable objects
  anchors: SceneAnchor[],         // Stationary objects with cases
  positions: PositionType[]      // Available positions for this scene
}
```

#### SceneSubject
```typescript
{
  n: string,    // Estonian noun (nominative)
  e: string     // Emoji representation
}
```

#### SceneAnchor
```typescript
{
  n: string,        // Estonian noun (nominative)
  adess: string,    // Adessive case (e.g., 'PUUL' - on the tree)
  iness: string,    // Inessive case (e.g., 'PUUS' - in the tree)
  genitive: string, // Genitive case (e.g., 'PUU' - of the tree)
  e: string         // Emoji representation
}
```

#### Position Types
- `NEXT_TO`: Side-by-side
- `ON`: Above
- `UNDER`: Below
- `IN_FRONT`: Overlapping, subject in front
- `BEHIND`: Overlapping, subject behind
- `INSIDE`: Subject contained within anchor

### 5. Level Progression

- **Level 1-2**: Simple scenes with 3-4 position types
- **Level 3-5**: Medium scenes with 4-5 position types
- **Level 6+**: All scenes with all position types

### 6. Error Handling

- If no scene found: Throw error
- If no subject/anchor found: Throw error
- If no position found: Throw error
- If not enough positions for wrong options: Use available positions, allow duplicates if necessary

### 7. Key Design Principles

1. **Same Objects, Different Positions**: All options use the same subject and anchor - only the spatial relationship changes. This teaches spatial concepts, not object recognition.

2. **Visual Clarity**: Each position must be visually distinct and pedagogically clear for children.

3. **Estonian Grammar Accuracy**: Proper case usage (genitive for postpositions, inessive for "inside").

4. **Responsive Design**: Works on mobile and desktop with appropriate sizing.

5. **Accessibility**: Clear visual feedback, readable text, proper contrast.

## Implementation Notes

### Current Issues to Fix
1. Position rendering is broken - especially `IN_FRONT` and `BEHIND` need proper overlap
2. Code is overly complex with redundant validation
3. Position matching logic is fragile

### Clean Implementation Goals
1. Simple, clear position rendering logic
2. Clean separation of concerns (generator vs renderer)
3. Type-safe position handling
4. Easy to test and maintain
5. Clear visual positioning that works reliably
