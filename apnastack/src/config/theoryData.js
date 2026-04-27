export const THEORY_DATA = {
  1: {
    name: "Stack",
    deep: "A Stack is a linear data structure that follows the Last-In, First-Out (LIFO) principle. Think of it like a stack of plates: you can only add or remove the top plate. This strict restriction makes it incredibly fast and useful for specific scenarios like reversing things, tracking state in parsing, or managing function calls in memory.",
    quick: "LIFO (Last-In, First-Out). Elements are added to the top and removed from the top.",
    complexities: {
      bestTime: "O(1)",
      avgTime: "O(1)",
      worstTime: "O(1)",
      space: "O(n)"
    },
    useCases: ["Undo/Redo features", "Browser history", "Call stack in programming languages", "Expression evaluation"]
  },
  2: {
    name: "Queue",
    deep: "A Queue is a linear data structure that follows the First-In, First-Out (FIFO) principle. It's exactly like waiting in line at a grocery store. The first person to join the line is the first one to be served. Queues are fundamental in scenarios where order of arrival matters and fairness must be maintained.",
    quick: "FIFO (First-In, First-Out). Elements enter from the back (enqueue) and leave from the front (dequeue).",
    complexities: {
      bestTime: "O(1)",
      avgTime: "O(1)",
      worstTime: "O(1)",
      space: "O(n)"
    },
    useCases: ["Task scheduling (OS)", "Print queues", "Handling requests in web servers", "Breadth-First Search (BFS)"]
  },
  3: {
    name: "Linked List",
    deep: "A Linked List is a linear data structure where elements (nodes) are not stored in contiguous memory locations. Instead, each node contains the data and a pointer to the next node. This allows for extremely efficient insertions and deletions since you only need to update pointers, unlike arrays which require shifting elements.",
    quick: "Nodes linked by pointers. Dynamic size, easy insertions/deletions, but slow random access.",
    complexities: {
      bestTime: "O(1)", 
      avgTime: "O(n)",  
      worstTime: "O(n)", 
      space: "O(n)"
    },
    useCases: ["Implementing Stacks/Queues", "Image viewers (Previous/Next)", "Hash table collision resolution"]
  },
  4: {
    name: "Tree (BST)",
    deep: "A Binary Search Tree (BST) is a hierarchical data structure where each node has at most two children. The left child's value is always less than the parent, and the right child's is greater. This property allows for binary search-like speed, halving the search space at every step, making it highly efficient for sorted data operations.",
    quick: "Hierarchical structure. Left child < Parent < Right child. Fast lookups and sorted traversal.",
    complexities: {
      bestTime: "O(log n)",
      avgTime: "O(log n)",
      worstTime: "O(n)",  
      space: "O(n)"
    },
    useCases: ["Databases (B-Trees)", "Auto-complete features", "Routing algorithms", "Decision trees"]
  },
  5: {
    name: "Graph",
    deep: "A Graph is a non-linear data structure consisting of vertices (nodes) and edges connecting them. It is the ultimate structure for representing relationships and networks. Graphs can be directed (one-way edges) or undirected, and edges can have weights (costs). Algorithms like BFS, DFS, and Dijkstra's use graphs to find shortest paths and analyze network topology.",
    quick: "Nodes connected by edges. Represents networks and relationships. Can be directed/undirected, weighted/unweighted.",
    complexities: {
      bestTime: "O(1)",
      avgTime: "O(V + E)", 
      worstTime: "O(V^2)", 
      space: "O(V + E)"
    },
    useCases: ["Social networks (Friends)", "Google Maps (Navigation)", "Internet routing", "Recommendation systems"]
  },
  6: {
    name: "Dynamic Programming",
    deep: "Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems. It solves each subproblem just once and stores their solutions (memoization or tabulation). By avoiding redundant calculations, DP transforms exponential time complexity into polynomial time, making previously impossible problems solvable.",
    quick: "Solve complex problems by breaking into overlapping subproblems and caching results to avoid repeating work.",
    complexities: {
      bestTime: "O(n)", 
      avgTime: "O(n^2)",
      worstTime: "Varies", 
      space: "O(n) - O(n^2)"
    },
    useCases: ["Shortest path finding", "Knapsack problem", "Sequence alignment in Bioinformatics", "Financial modeling"]
  },
  7: {
    name: "Backtracking",
    deep: "Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints of the problem at any point of time. It's essentially an optimized brute-force search that explores all possibilities but stops (backtracks) early when it hits a dead end.",
    quick: "Explore all possibilities incrementally. If a path fails constraints, undo the last step and try another path.",
    complexities: {
      bestTime: "Varies",
      avgTime: "O(b^d)", 
      worstTime: "O(N!)", 
      space: "O(N)"
    },
    useCases: ["Sudoku solvers", "N-Queens problem", "Maze solving", "Combinatorial optimization"]
  },
  8: {
    name: "Divide & Conquer",
    deep: "Divide and Conquer involves recursively breaking down a problem into two or more sub-problems of the same or related type, until these become simple enough to be solved directly. The solutions to the sub-problems are then combined to give a solution to the original problem. Merge Sort and Quick Sort are classic examples.",
    quick: "Divide problem into smaller subproblems, conquer them recursively, and combine their results.",
    complexities: {
      bestTime: "O(n log n)",
      avgTime: "O(n log n)",
      worstTime: "O(n^2)", 
      space: "O(log n) - O(n)"
    },
    useCases: ["Merge Sort / Quick Sort", "Binary Search", "Fast Fourier Transform (FFT)", "Closest pair of points"]
  },
  9: {
    name: "Greedy Algorithms",
    deep: "A Greedy Algorithm builds up a solution piece by piece, always choosing the next piece that offers the most immediate benefit (the local optimum). While it doesn't always guarantee the globally optimal solution for every problem, it is blazingly fast and works perfectly for problems that have the 'greedy-choice property' like fractional knapsack or making change with standard coins.",
    quick: "Always make the locally optimal choice at each step with the hope of finding a global optimum.",
    complexities: {
      bestTime: "O(n)", 
      avgTime: "O(n log n)", 
      worstTime: "O(n^2)",
      space: "O(1) - O(n)"
    },
    useCases: ["Coin change problem", "Huffman coding (Data compression)", "Prim's & Kruskal's algorithms", "Job scheduling"]
  },
  10: {
    name: "Sorting Algorithms",
    deep: "Sorting algorithms rearrange elements in a specific order (ascending or descending). Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order (very slow for large datasets). Quick Sort divides the array around a pivot and recursively sorts the sub-arrays, making it one of the fastest general-purpose sorting algorithms.",
    quick: "Rearranging data into a specific order to optimize search operations. O(N^2) for Bubble, O(N log N) for Quick.",
    complexities: {
      bestTime: "O(n)", 
      avgTime: "O(n log n)", 
      worstTime: "O(n^2)", 
      space: "O(1) - O(n)"
    },
    useCases: ["Database indexing", "Data analysis", "E-commerce product filtering", "Preprocessing for binary search"]
  },
  11: {
    name: "Recursion",
    deep: "Recursion occurs when a function calls itself to solve a smaller instance of the same problem. Every recursive function must have a base case (to stop) and a recursive step (to move closer to the base case). While mathematically elegant, recursion uses the call stack, so deep recursion can lead to stack overflow errors. It is the foundation for Trees, Graphs, DP, and Backtracking.",
    quick: "A function calling itself. Requires a base case to terminate and a recursive step. Uses memory stack.",
    complexities: {
      bestTime: "O(1)",
      avgTime: "O(n)", 
      worstTime: "O(2^n)", 
      space: "O(Depth)"
    },
    useCases: ["Tree/Graph traversals", "Mathematical sequences (Fibonacci)", "Fractal generation", "Parsing algorithms"]
  }
};
