-- Add solution explanations and key concepts for existing problems

-- Two Sum
UPDATE problems 
SET 
  solution_explanation = 'This problem demonstrates the classic "hash map" approach to solving array problems efficiently.

**Algorithm Steps:**
1. Create a hash map to store each number and its index
2. For each number, calculate the complement (target - current number)
3. Check if the complement exists in the hash map
4. If found, return the indices; otherwise, store the current number and its index

**Time Complexity:** O(n) - We visit each element once
**Space Complexity:** O(n) - We store up to n elements in the hash map

**Why This Works:**
Instead of checking every pair of numbers (which would be O(n²)), we use a hash map to achieve O(1) lookup time. This transforms a brute force solution into an elegant, efficient algorithm.',
  key_concepts = ARRAY['Hash Map', 'Array Traversal', 'Complement Logic', 'Time-Space Tradeoff']
WHERE title = 'Two Sum';

-- FizzBuzz
UPDATE problems 
SET 
  solution_explanation = 'FizzBuzz is a classic programming problem that tests your understanding of loops and conditional logic.

**Algorithm Steps:**
1. Loop through numbers from 1 to n
2. For each number, check divisibility in order:
   - If divisible by both 3 and 5 (i.e., 15), append "FizzBuzz"
   - Else if divisible by 3, append "Fizz"
   - Else if divisible by 5, append "Buzz"
   - Otherwise, append the number as a string

**Key Points:**
- Check for "FizzBuzz" first (divisible by 15) to avoid conflicts
- Use modulo operator (%) to check divisibility
- Convert numbers to strings when adding to array

**Time Complexity:** O(n) - We visit each number once
**Space Complexity:** O(n) - We store n results in the array',
  key_concepts = ARRAY['Loops', 'Conditional Logic', 'Modulo Operator', 'String Conversion', 'Divisibility Rules']
WHERE title = 'FizzBuzz';

-- Valid Anagram
UPDATE problems 
SET 
  solution_explanation = 'This problem demonstrates character frequency counting, a fundamental technique in string processing.

**Algorithm Steps:**
1. Check if strings have the same length (different lengths = not anagrams)
2. Create a character frequency map for the first string
3. Decrement frequencies for characters in the second string
4. Check if all frequencies are zero

**Alternative Approaches:**
- **Sorting:** Sort both strings and compare (O(n log n) time)
- **Hash Map:** Count frequencies (O(n) time, O(1) space for fixed alphabet)
- **Array Counter:** Use array instead of map for better performance

**Why Hash Map Works:**
Anagrams have identical character frequencies. By counting and comparing frequencies, we can determine if two strings are anagrams without sorting.',
  key_concepts = ARRAY['Character Frequency', 'Hash Map', 'String Processing', 'Anagram Logic', 'Frequency Counting']
WHERE title = 'Valid Anagram';

-- Binary Search
UPDATE problems 
SET 
  solution_explanation = 'Binary search is one of the most important algorithms in computer science, demonstrating the power of divide-and-conquer.

**Algorithm Steps:**
1. Set left pointer to 0, right pointer to array length - 1
2. While left <= right:
   - Calculate middle index: (left + right) / 2
   - If target equals middle element, return middle index
   - If target is less than middle, search left half (right = middle - 1)
   - If target is greater than middle, search right half (left = middle + 1)
3. Return -1 if target not found

**Key Insights:**
- **Prerequisite:** Array must be sorted
- **Efficiency:** Eliminates half the search space each iteration
- **Overflow Protection:** Use (left + right) >> 1 or left + (right - left) / 2

**Time Complexity:** O(log n) - Halves search space each iteration
**Space Complexity:** O(1) - Uses only a few variables

**Why It Works:**
By comparing the target with the middle element, we can eliminate half the array in each step, leading to logarithmic time complexity.',
  key_concepts = ARRAY['Divide and Conquer', 'Search Algorithm', 'Sorted Arrays', 'Logarithmic Time', 'Two Pointers']
WHERE title = 'Binary Search';

-- Valid Parentheses
UPDATE problems 
SET 
  solution_explanation = 'This problem demonstrates the classic stack-based approach to matching brackets and parentheses.

**Algorithm Steps:**
1. Create a stack to track opening brackets
2. Create a mapping of closing to opening brackets
3. For each character:
   - If it''s an opening bracket, push to stack
   - If it''s a closing bracket:
     - Check if stack is empty (unmatched closing bracket)
     - Pop from stack and verify it matches the closing bracket
4. Return true if stack is empty (all brackets matched)

**Key Concepts:**
- **Stack LIFO Property:** Last opened bracket must be first closed
- **Bracket Mapping:** Use hash map for O(1) lookup
- **Edge Cases:** Empty string, unmatched brackets, empty stack

**Time Complexity:** O(n) - Visit each character once
**Space Complexity:** O(n) - Stack can grow to size n in worst case

**Why Stack Works:**
Parentheses have a nested structure. The stack naturally handles this by storing opening brackets and matching them with closing brackets in LIFO order.',
  key_concepts = ARRAY['Stack Data Structure', 'Bracket Matching', 'LIFO Principle', 'Hash Map', 'String Validation']
WHERE title = 'Valid Parentheses';

-- Maximum Subarray (Kadane's Algorithm)
UPDATE problems 
SET 
  solution_explanation = 'This problem introduces Kadane''s Algorithm, a brilliant dynamic programming approach for finding maximum subarray sum.

**Algorithm Steps:**
1. Initialize current_sum and max_sum to first element
2. For each element starting from index 1:
   - Update current_sum: max(current element, current_sum + current element)
   - Update max_sum: max(max_sum, current_sum)
3. Return max_sum

**Key Insight - The Reset Decision:**
At each position, we decide whether to:
- **Extend** the existing subarray (current_sum + current element)
- **Reset** and start fresh (current element)

We choose whichever gives a larger sum.

**Why This Works:**
If adding a previous subarray makes the sum smaller than starting fresh, we abandon the previous subarray. This greedy approach surprisingly gives us the optimal solution.

**Time Complexity:** O(n) - Single pass through array
**Space Complexity:** O(1) - Only two variables needed',
  key_concepts = ARRAY['Dynamic Programming', 'Kadane''s Algorithm', 'Greedy Approach', 'Subarray Problems', 'Maximum Sum']
WHERE title = 'Maximum Subarray';

-- Merge Sorted Arrays
UPDATE problems 
SET 
  solution_explanation = 'This problem demonstrates the merge step from merge sort, a fundamental divide-and-conquer technique.

**Algorithm Steps:**
1. Start from the end of both arrays (largest elements)
2. Compare elements and place the larger one at the end of nums1
3. Move pointers backwards as we fill the array
4. Continue until all elements from nums2 are processed

**Key Insights:**
- **Work Backwards:** Start from the end to avoid overwriting unprocessed elements
- **Three Pointers:** One for nums1, one for nums2, one for the merge position
- **Handle Remaining Elements:** Process any remaining elements in nums2

**Why Backwards Works:**
Since nums1 has extra space at the end, working backwards ensures we never overwrite elements we haven''t processed yet.

**Time Complexity:** O(m + n) - Visit each element once
**Space Complexity:** O(1) - No extra space needed (modify nums1 in place)',
  key_concepts = ARRAY['Merge Sort', 'Two Pointers', 'In-Place Merging', 'Divide and Conquer', 'Sorted Arrays']
WHERE title = 'Merge Sorted Arrays';

-- Climbing Stairs
UPDATE problems 
SET 
  solution_explanation = 'This problem introduces dynamic programming through the classic Fibonacci sequence pattern.

**Algorithm Steps:**
1. Recognize the pattern: ways(n) = ways(n-1) + ways(n-2)
2. Use bottom-up approach:
   - Base cases: 1 way for 1 step, 2 ways for 2 steps
   - For each step i > 2: ways[i] = ways[i-1] + ways[i-2]
3. Return ways[n]

**Key Insights:**
- **Fibonacci Pattern:** Each step depends on previous two steps
- **Bottom-Up DP:** Build solution from base cases
- **Space Optimization:** Only need last two values, not entire array

**Why This Works:**
To reach step n, you can either:
- Come from step (n-1) with a 1-step jump
- Come from step (n-2) with a 2-step jump

This gives us the recurrence relation that matches the Fibonacci sequence.

**Time Complexity:** O(n) - Visit each step once
**Space Complexity:** O(1) - Only store last two values',
  key_concepts = ARRAY['Dynamic Programming', 'Fibonacci Sequence', 'Bottom-Up DP', 'Recurrence Relation', 'Space Optimization']
WHERE title = 'Climbing Stairs';
