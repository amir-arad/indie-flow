# IndieFlow System

## Overview
A lightweight system for independent creators to maintain momentum. Designed for solo developers, creative professionals, entrepreneurs, and independent consultants.

## Design Principles
- Minimize overhead
  - No backlog management
  - No premature planning
  - Decisions made only at execution time
- Compatible with existing work methods (Pomodoro, Kanban, etc.)
- Adaptable prioritization through replaceable scoring system
- Single focus: streamline path from idea to completion

## Project Model
- Project is a tree that emerges during execution
- Tasks reveal their true nature only when processed:
  - Become Planning Tasks (junctions) when broken down
  - Become Execution Tasks (leaves) when completed directly

## System State
- Frontier: Set of available tasks
- Current: Active task
- Done: Tasks in final states:
  - "Planned": Task became a junction (broken down)
  - "Completed": Task finalized as leaf (executed)

## Work Unit Definition
- Fixed unit of time/effort per project
- Compatible with any work method
- Used for task classification during execution

## Core Algorithm
```
Initialize:
  work_unit = set_work_unit()
  project_completion_criteria = set_criteria()
  frontier = [project_completion_criteria]
  current_task = None
  done = []

Loop:
  next = max(scoring_system, frontier)
  current_task = next
  
  # Task nature revealed during processing
  if estimate(work_unit, current_task) > 1: # Junction node
    subtasks = breakdown(current_task)
    frontier.extend(subtasks)
    mark_as_planned(current_task)    
  else: # Leaf node
    execute(current_task)
    mark_as_completed(current_task)  
    
  done.append(current)
  frontier.remove(current)
  update_affected_tasks(current)
```

## Core Operations
1. Create Task
   - Define completion criteria

2. Estimate Task
   - Only happens when task becomes active
   - Binary decision: fits in 1 Work Unit or needs breakdown

3. Break Down Task
   - Define completion in terms of smaller tasks
   - Create new task for each part
   - Original task marked as "planned"
   - Task becomes a junction in tree

4. Execute Task
   - Complete work to achieve completion criteria
   - Mark as "completed"
   - Task remains a leaf in tree

## System States
Every task starts with potential to become either:
- Junction: When broken down into constituent tasks
- Leaf: When completed directly

Final states:
- "Planned": Task became a junction (broken down)
- "Completed": Task finalized as a leaf (executed)

## Task Prioritization
The system is designed to work with any scoring method. RCVLF is a reference implementation that balances multiple concerns:

## RCVLF Scoring System
Score = R + C×V + L + F

Component | Range | Description
----------|--------|-------------
R (Resolution) | 0+ | Task depth in emerging tree
C (Confidence) | 0.0-1.0 | Success probability
V (Value) | 1-3 | Core importance
L (Learning) | 1-3 | Information gain potential
F (Focus) | 0-2 | Mental locality bonus

### Score Component Details
- Value (V):
  - 3: Core functionality/Critical path
  - 2: Supporting components/Enablers
  - 1: Nice-to-haves/Polish

- Learning (L):
  - 3: Affects multiple major branches/Could invalidate approach
  - 2: Affects one major branch/Local architectural impact
  - 1: Minor uncertainties/Implementation details

- Confidence (C):
  - 1.0: Clear implementation path
  - 0.5: Known technology/approach
  - 0.2: Research needed
  - 0.0: Complete unknown

- Focus (F):
  - 2: Child of current task
  - 1: Sibling of current task
  - 0: Elsewhere in tree

### Dynamic Updates
- External events can modify V, C, L values
- R, F computed automatically from tree structure and progress
- Scores update after task completion

## System Constraints
- Each task requires completion criteria
- Only active tasks are estimated
- Single active task at a time
- Task type (planning/execution) only known after processing

## System Scope Limitations
- No project-wide estimations
- No cross-hierarchy dependencies
- No team coordination mechanisms
