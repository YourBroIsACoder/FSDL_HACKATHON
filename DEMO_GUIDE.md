# AlgoReef — Demo Testing Guide 🎮

> **How to use this guide:** Open the app at `http://localhost:5173`, click a tab, dismiss the intro overlay, then follow the steps below. Enter the exact values shown in the input box and click the corresponding button.

---

## 🧱 Stack (Tab: STACK)

**Concept:** Last-In, First-Out (LIFO). Like a stack of plates.

| Step | Input Box Value | Button | Expected Result |
|------|----------------|--------|-----------------|
| 1 | `10` | **PUSH** | Node `10` appears at the top |
| 2 | `25` | **PUSH** | Node `25` stacks on top of `10` |
| 3 | `40` | **PUSH** | Node `40` is now the topmost |
| 4 | *(empty)* | **POP** | Node `40` is removed — `25` is now top |
| 5 | *(empty)* | **PEEK** | `25` glows (highlighted) but stays |

---

## 📦 Queue (Tab: QUEUE)

**Concept:** First-In, First-Out (FIFO). Like a line at a store.

| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `1` | **ENQUEUE** | Node `1` enters from the back |
| 2 | `2` | **ENQUEUE** | Node `2` joins behind `1` |
| 3 | `3` | **ENQUEUE** | Node `3` joins at the back |
| 4 | *(empty)* | **DEQUEUE** | Node `1` exits from the front |

---

## 🔗 Linked List (Tab: LLIST)

**Concept:** Dynamic chain of nodes where each points to the next.

| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `5` | **INSERT** | Node `5` is added, arrow links form |
| 2 | `10` | **INSERT** | Node `10` chained to `5` |
| 3 | `15` | **INSERT** | Chain: `5 → 10 → 15` |
| 4 | *(empty)* | **DELETE** | Last node (`15`) is removed |

---

## 🌳 Tree (Tab: TREE)

**Concept:** Hierarchical data structure — Binary Search Tree (BST).

| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `50` | **INSERT** | Root node `50` appears |
| 2 | `25` | **INSERT** | `25` goes left of `50` |
| 3 | `75` | **INSERT** | `75` goes right of `50` |
| 4 | `10` | **INSERT** | `10` goes left of `25` |
| 5 | *(empty)* | **BFS** | Nodes light up level by level |
| 6 | *(empty)* | **DFS** | Nodes light up depth-first |

---

## 🕸 Graph (Tab: GRAPH)

**Concept:** Nodes connected by edges — models networks, maps, etc.

| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `A` | **ADD NODE** | Node labelled `A` appears |
| 2 | `B` | **ADD NODE** | Node `B` appears |
| 3 | `C` | **ADD NODE** | Node `C` appears |
| 4 | `A-B` | **ADD EDGE** | An edge forms between A and B |
| 5 | `B-C` | **ADD EDGE** | Edge forms between B and C |
| 6 | *(empty)* | **BFS** | Highlights spread from A outward |

> ✅ **Edge syntax:** Type `A-B` or `A,B` to connect those two nodes.

---

## 📊 Dynamic Programming (Tab: DP)

**Concept:** Grid Traveler — how many paths from top-left to bottom-right?

| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `3` | **RUN DP** | 3×3 grid fills cell by cell. Bottom-right = `6` |
| 2 | `4` | **RUN DP** | 4×4 grid. Bottom-right = `20` |
| 3 | `5` | **RUN DP** | 5×5 grid. Bottom-right = `70` |
| 4 | *(empty)* | **RESET** | Grid clears |

**Formula:** `dp[r][c] = dp[r-1][c] + dp[r][c-1]` (top + left)

---

## ♟ Backtracking / N-Queens (Tab: BACKTRACKING)

**Concept:** Place N queens on an N×N board so none attack each other.

| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `4` | **FIND PATH** | 4×4 board — yellow checks, red backtracks, green = solution found |
| 2 | `6` | **FIND PATH** | 6×6 board — more complex search tree visible |
| 3 | `8` | **FIND PATH** | Full 8-Queens classic problem |

> 🟡 Yellow = checking if queen is safe  
> 🔴 Red = clash detected → backtrack  
> 🟢 Green = queen successfully placed  

---

## ⚡ Divide & Conquer (Tab: DIV&CONQ)

**Concept:** Merge Sort — recursively split array until single elements, then merge sorted.

| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `8,3,5,1` | **RESET** | Array `[8,3,5,1]` loaded into a single block |
| 2 | *(empty)* | **SPLIT** | Block splits into `[8,3]` and `[5,1]` |
| 3 | *(empty)* | **SPLIT** | Splits again into `[8]`,`[3]`,`[5]`,`[1]` |
| 4 | `12,7,3,9,2,5` | **RESET** | Loads your custom 6-element array |
| 5 | *(click SPLIT 3×)* | **SPLIT** | Fully divided |

---

## 🪙 Greedy / Coin Change (Tab: GREEDY)

**Concept:** Use the fewest coins (25¢, 10¢, 5¢, 1¢) to make a target amount.

| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `41` | **CLIMB** | 1×25 + 1×10 + 1×5 + 1×1 = 4 coins |
| 2 | `87` | **CLIMB** | 3×25 + 1×10 + 2×1 = 6 coins |
| 3 | `30` | **CLIMB** | 1×25 + 1×5 = 2 coins |
| 4 | `99` | **CLIMB** | 3×25 + 2×10 + 4×1 = 9 coins |
| 5 | *(empty)* | **RESET** | All coins cleared |

> **Note:** Coins physically animate from the bank stacks into the collection ring.

---

## 🫧 Sorting (Tab: SORTING)

**Concept:** Rearrange an array from unsorted to sorted order.

### Bubble Sort
| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `9,4,7,2,8,1` | **BUBBLE** | Bars animate, adjacent pairs compared & swapped |
| 2 | *(wait for bloom)* | — | Array fully sorted left→right in ascending order |

### Quick Sort
| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `5,3,8,1,9,2,7` | **QUICK** | Pivot chosen (rightmost), elements partition around it |
| 2 | `6,6,1,4` | **QUICK** | Handles duplicates correctly |

### Reset with Custom Array
| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `10,3,7,1,8` | **RESET** | Array resets to your custom values |
| 2 | *(empty)* | **BUBBLE** | Sorts the custom array you just set |

---

## 🌀 Recursion / Call Stack (Tab: RECURSION)

**Concept:** `factorial(n)` — visualizes the call stack growing and resolving.

| Step | Input | Button | Expected Result |
|------|-------|--------|-----------------|
| 1 | `4` | **RECURSE** | 4 frames stack: `factorial(4)`, `factorial(3)`, `factorial(2)`, `factorial(1)` |
| 2 | `6` | **RECURSE** | 6 frames. Base case `factorial(1)` glows green. Then unwinds upward showing values |
| 3 | `8` | **RECURSE** | Deep stack. Watch values compute as frames pop: 1→2→6→24→120→720→5040→40320 |
| 4 | *(empty)* | **RESET** | Stack clears to empty |

> 🔵 Blue frame = calling phase (building the stack)  
> 🟢 Green frame = base case reached  
> 🟠 Orange frame = returning phase (unwinding with computed values)

---

## 🏆 Quick Reference Card

| Tab | Algo | Input Format | Key Concept |
|-----|------|-------------|-------------|
| Stack | LIFO | single number | `42` |
| Queue | FIFO | single number | `99` |
| Linked List | Dynamic chain | single number | `7` |
| Tree | BST | single number | `50` |
| Graph | Networks | label or `A-B` for edge | `A`, then `A-B` |
| DP | Grid Traveler | grid size (2–6) | `4` |
| Backtracking | N-Queens | board size (4–8) | `6` |
| Div & Conq | Merge Sort | `a,b,c,d` or empty | `8,3,5,1` |
| Greedy | Coin Change | total cents | `87` |
| Sorting | Bubble/Quick | `a,b,c,d` or empty | `9,4,7,2` |
| Recursion | Factorial Stack | depth (1–10) | `6` |
