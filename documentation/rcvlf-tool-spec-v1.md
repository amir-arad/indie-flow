# RCVLF Project Management Tool Specification v1.0

## Overview
A simple visual tool for RCVLF project management that displays a task tree, calculates scores, and tracks frontier tasks.

## Core Components

### 1. Task Tree View
- Vertical tree layout
- Node display:
  - Task name
  - Status icon:
    - ⚪ Pending (default for new tasks)
    - ❌ Irrelevant (marked as not needed)
    - 🟢 Active (currently being worked on)
    - 📋 Planned (broken down into subtasks)
    - ✅ Done (completed as execution task)
  - Score (if in frontier)
- Colors:
  - Pending: Light blue
  - Active: Yellow
  - Planned/Done/Irrelevant: Gray
- Show lines connecting parent-child tasks

### 2. Scoring System
- Total score display (one decimal place)
- Manual input fields for new tasks:
  - Confidence (0.0-1.0)
  - Value (1-3)
  - Learning (1-3)
- Automatic calculations:
  - Resolution = task depth
  - Focus = position relative to active task
- Formula: R + C×V + L + F
- Root task fixed scores:
  - Resolution: 0
  - Confidence: 1.0
  - Value: 3
  - Learning: 3
  - Focus: 2
  - Total initial score: 0 + (1.0 × 3) + 3 + 2 = 8.0

### 3. Frontier List
- List of pending tasks only
- Show for each task:
  - Name
  - Total score
  - Status icon
- Sort by total score (high to low)

### 4. Core Operations
- Define root task (project start)
  - Name only
  - Scores automatically set to maximum
  - Status: pending
- Set task status:
  - Mark as active (start working)
  - Mark as irrelevant (not needed)
  - Mark as planned (when broken down)
  - Mark as done (completed execution)
- Break down task
  - Add multiple subtasks (all start as pending)
  - Original task becomes "planned"
- Validation:
  - Only active tasks can be broken down
  - Only active tasks can be marked done
  - Root task required to start

### 5. Layout
- Two fixed panels:
  - Tree view (left)
  - Frontier list (right)
- Window size: minimum 800x600px

## Limitations
- Single project only
- No user accounts
- No task dependencies
- No data persistence
- No keyboard shortcuts
- No responsive design
- No animations
- No undo feature

---
Version: 1.0
Status: Ready for implementation
Last updated: 2024-11-19
