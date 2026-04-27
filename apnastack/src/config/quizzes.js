export const QUIZ_DATA = {
  1: { // Stack
    questions: [
      {
        q: "What is the primary access principle of a Stack?",
        options: ["FIFO (First In First Out)", "LIFO (Last In First Out)", "Random Access", "Priority Based"],
        correct: 1
      },
      {
        q: "Which operation is used to remove the top element of a stack?",
        options: ["Push", "Enqueue", "Pop", "Peek"],
        correct: 2
      },
      {
        q: "A postfix expression '2 3 + 5 *' evaluates to what?",
        options: ["25", "10", "13", "15"],
        correct: 0
      }
    ]
  },
  2: { // Queue
    questions: [
      {
        q: "Which principle does a Queue follow?",
        options: ["LIFO", "FIFO", "FILO", "LILO"],
        correct: 1
      },
      {
        q: "In a CPU Round Robin scheduler, what data structure is typically used?",
        options: ["Stack", "Queue", "Binary Tree", "Linked List"],
        correct: 1
      }
    ]
  },
  3: { // Linked List
    questions: [
      {
        q: "What is the time complexity to insert an element at the head of a Singly Linked List?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correct: 0
      },
      {
        q: "To reverse a linked list, how many pointers do we typically need to track?",
        options: ["1", "2", "3", "4"],
        correct: 2
      }
    ]
  },
  10: { // Sorting
    questions: [
      {
        q: "What is the worst-case time complexity of Bubble Sort?",
        options: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
        correct: 2
      },
      {
        q: "Which sorting algorithm is generally faster on random large datasets?",
        options: ["Bubble Sort", "Quick Sort", "Insertion Sort", "Selection Sort"],
        correct: 1
      }
    ]
  }
}
