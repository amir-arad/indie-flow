# RCVLF Tool v2 Complete Specification

## Core Features

### 1. Work Units
- User-defined time/effort measure
- Examples:
  - "30 minute blocks"
  - "2 hour sessions"
  - "Story points"
- Used for binary task estimation
- Configurable in settings

### 2. Task States
- Pending (in frontier)
- Active (current focus)
- Planned (broken down)
- Completed (executed)

### 3. Task Processing Flow
1. Select highest scoring frontier task
2. Task becomes active
3. Enter RCVLF scores
4. Estimate if task fits in one work unit
5. If fits: Execute and mark completed
6. If doesn't fit: Break down and mark planned

## Data Model

```typescript
interface Task {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'planned' | 'completed';
  parentId?: string;
  children?: string[];
  path?: string[];
  
  // Only set when active
  fitsWorkUnit?: boolean;
  scores?: {
    confidence: number;  // 0-1
    value: number;      // 1-3
    learning: number;   // 1-3
  };
  // Calculated
  resolution?: number;  // depth in tree
  focus?: number;      // 0-2 based on active task
  totalScore?: number;
}

interface ProjectSettings {
  workUnit: {
    type: 'time' | 'effort';
    value: number;
    unit: string;
  };
  viewPreferences: {
    layout: 'split' | 'full';
    activeViews: ('tree' | 'kanban' | 'ancestry')[];
    expanded: string[];
  };
}
```

## Views

### 1. Kanban Board
- Columns:
  - Frontier (pending)
  - In Progress (active)
  - Done (planned + completed)
- Features:
  - Sort frontier by score
  - Color-coded cards by status
  - Score displayed on cards
  - Click card to show ancestry
  - Drag between columns disabled (state changes through flow)

### 2. Tree View
- Features:
  - Full hierarchy display
  - Collapsible nodes
  - Highlight active task path
  - Color-coded nodes
  - Scores on frontier tasks
  - Click node to show ancestry
  - No drag-drop (enforces flow)

### 3. Ancestry Panel
- Shows when task selected
- Displays:
  - Full path from root
  - Status of each ancestor
  - Scores where applicable
  - Work unit decision points

### 4. Layout Options
- Split view modes:
  - Tree + Kanban
  - Tree + Ancestry
  - Kanban + Ancestry
- Full view (single panel)
- Collapsible panels
- Persistent preferences

## Task Operations

### 1. Create Task
- Required:
  - Name
  - Completion criteria
- System sets:
  - Status (pending)
  - Parent link
  - Path

### 2. Activate Task
- System:
  - Updates old active task
  - Recalculates focus scores
  - Shows scoring inputs

### 3. Score Task
- User inputs:
  - Confidence (0-1)
  - Value (1-3)
  - Learning (1-3)
- System calculates:
  - Resolution (depth)
  - Focus (position)
  - Total score

### 4. Process Task
- Estimate work unit fit
- Execute or break down
- System updates:
  - Status
  - Tree structure
  - Ancestry paths
  - Focus scores

## UI Components

### 1. Toolbar
- View switcher
- Work unit display
- Tree controls
- Quick task add
- Settings access

### 2. Task Card
- Shows:
  - Name
  - Status
  - Score (if in frontier)
  - Work unit decision (if active)
- Actions:
  - Select
  - Start (if in frontier)
  - Mark done/Plan (if active)

### 3. Settings Panel
- Work unit configuration
- View preferences
- Color scheme
- Panel layout

## Constraints

### 1. Task Rules
- Single active task
- No manual state changes
- No direct tree editing
- No dependencies

### 2. Estimation
- Binary work unit fit only
- Only estimate active task
- No time/effort predictions

### 3. Scoring
- RCVLF only on active task
- Auto-update affected scores
- No manual score adjustment

## Not Included
- Multiple projects
- Team features
- Time tracking
- External integrations
- Data export/import
- Undo/redo
- Custom scoring methods
- Manual tree reorganization

## Technical Requirements
- Browser-based
- Local storage
- No backend required
- Mobile view not required

Version: 2.0
Status: Ready for implementation
Last updated: 2024-11-21
