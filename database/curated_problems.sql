-- Curated DSA Problems Catalog
-- Essential problems for learning data structures and algorithms fundamentals

-- Level 1: Arrays & Basic Logic (5-8 min each)
INSERT INTO problems (title, description, category, solution_code, estimated_time_minutes) VALUES
('Two Sum', 'Given an array of integers and a target sum, find two numbers that add up to the target.', 'arrays', 
'function twoSum(nums, target) {
	const map = new Map();
	for (let i = 0; i < nums.length; i++) {
		const complement = target - nums[i];
		if (map.has(complement)) {
			return [map.get(complement), i];
		}
		map.set(nums[i], i);
	}
	return [];
}', 8),

('Reverse Array', 'Reverse an array in-place without using extra space.', 'arrays',
'function reverseArray(nums) {
	let left = 0;
	let right = nums.length - 1;
	
	while (left < right) {
		[nums[left], nums[right]] = [nums[right], nums[left]];
		left++;
		right--;
	}
	return nums;
}', 6),

('Find Maximum', 'Find the maximum element in an array.', 'arrays',
'function findMaximum(nums) {
	let max = nums[0];
	for (let i = 1; i < nums.length; i++) {
		if (nums[i] > max) {
			max = nums[i];
		}
	}
	return max;
}', 5),

('Contains Duplicate', 'Check if an array contains any duplicates.', 'arrays',
'function containsDuplicate(nums) {
	const seen = new Set();
	for (let num of nums) {
		if (seen.has(num)) {
			return true;
		}
		seen.add(num);
	}
	return false;
}', 6),

-- Level 2: Strings & Loops (8-12 min each)
('FizzBuzz', 'Write a function that prints the numbers from 1 to n. For multiples of 3, print "Fizz" instead of the number. For multiples of 5, print "Buzz". For multiples of both 3 and 5, print "FizzBuzz".', 'loops',
'function fizzBuzz(n) {
	for (let i = 1; i <= n; i++) {
		if (i % 15 === 0) {
			console.log("FizzBuzz");
		} else if (i % 3 === 0) {
			console.log("Fizz");
		} else if (i % 5 === 0) {
			console.log("Buzz");
		} else {
			console.log(i);
		}
	}
}', 8),

('Valid Parentheses', 'Given a string containing just parentheses, determine if the input string is valid.', 'strings',
'function isValid(s) {
	const stack = [];
	const mapping = { ")": "(", "}": "{", "]": "[" };
	
	for (let char of s) {
		if (char in mapping) {
			const topElement = stack.pop() || "#";
			if (mapping[char] !== topElement) {
				return false;
			}
		} else {
			stack.push(char);
		}
	}
	
	return stack.length === 0;
}', 10),

('Reverse String', 'Write a function that reverses a string.', 'strings',
'function reverseString(s) {
	let left = 0;
	let right = s.length - 1;
	
	while (left < right) {
		[s[left], s[right]] = [s[right], s[left]];
		left++;
		right--;
	}
	
	return s;
}', 8),

('First Unique Character', 'Find the first non-repeating character in a string.', 'strings',
'function firstUniqChar(s) {
	const charCount = {};
	
	for (let char of s) {
		charCount[char] = (charCount[char] || 0) + 1;
	}
	
	for (let i = 0; i < s.length; i++) {
		if (charCount[s[i]] === 1) {
			return i;
		}
	}
	
	return -1;
}', 10),

-- Level 3: Sorting & Searching (10-15 min each)
('Binary Search', 'Search for a target value in a sorted array.', 'searching',
'function search(nums, target) {
	let left = 0;
	let right = nums.length - 1;
	
	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		
		if (nums[mid] === target) {
			return mid;
		} else if (nums[mid] < target) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}
	
	return -1;
}', 12),

('Merge Sorted Arrays', 'Merge two sorted arrays into one sorted array.', 'arrays',
'function merge(nums1, m, nums2, n) {
	let i = m - 1;
	let j = n - 1;
	let k = m + n - 1;
	
	while (i >= 0 && j >= 0) {
		if (nums1[i] > nums2[j]) {
			nums1[k] = nums1[i];
			i--;
		} else {
			nums1[k] = nums2[j];
			j--;
		}
		k--;
	}
	
	while (j >= 0) {
		nums1[k] = nums2[j];
		j--;
		k--;
	}
	
	return nums1;
}', 15),

('Find Peak Element', 'Find a peak element in an array (greater than its neighbors).', 'searching',
'function findPeakElement(nums) {
	let left = 0;
	let right = nums.length - 1;
	
	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		
		if (nums[mid] > nums[mid + 1]) {
			right = mid;
		} else {
			left = mid + 1;
		}
	}
	
	return left;
}', 12),

-- Level 4: Basic Data Structures (12-15 min each)
('Valid Anagram', 'Determine if two strings are anagrams of each other.', 'strings',
'function isAnagram(s, t) {
	if (s.length !== t.length) {
		return false;
	}
	
	const charCount = {};
	
	for (let char of s) {
		charCount[char] = (charCount[char] || 0) + 1;
	}
	
	for (let char of t) {
		if (!charCount[char]) {
			return false;
		}
		charCount[char]--;
	}
	
	return true;
}', 10),

('Group Anagrams', 'Group strings that are anagrams of each other.', 'strings',
'function groupAnagrams(strs) {
	const groups = {};
	
	for (let str of strs) {
		const sorted = str.split('').sort().join('');
		if (!groups[sorted]) {
			groups[sorted] = [];
		}
		groups[sorted].push(str);
	}
	
	return Object.values(groups);
}', 15),

('Maximum Subarray', 'Find the contiguous subarray with the largest sum.', 'arrays',
'function maxSubArray(nums) {
	let maxSum = nums[0];
	let currentSum = nums[0];
	
	for (let i = 1; i < nums.length; i++) {
		currentSum = Math.max(nums[i], currentSum + nums[i]);
		maxSum = Math.max(maxSum, currentSum);
	}
	
	return maxSum;
}', 12),

-- Level 5: Simple Algorithms (15+ min each)
('Climbing Stairs', 'Find the number of distinct ways to climb n stairs (1 or 2 steps at a time).', 'algorithms',
'function climbStairs(n) {
	if (n <= 2) {
		return n;
	}
	
	let prev2 = 1;
	let prev1 = 2;
	
	for (let i = 3; i <= n; i++) {
		const current = prev1 + prev2;
		prev2 = prev1;
		prev1 = current;
	}
	
	return prev1;
}', 15),

('House Robber', 'Find the maximum money you can rob from houses without robbing adjacent ones.', 'algorithms',
'function rob(nums) {
	if (nums.length === 0) return 0;
	if (nums.length === 1) return nums[0];
	
	let prev2 = nums[0];
	let prev1 = Math.max(nums[0], nums[1]);
	
	for (let i = 2; i < nums.length; i++) {
		const current = Math.max(prev1, prev2 + nums[i]);
		prev2 = prev1;
		prev1 = current;
	}
	
	return prev1;
}', 18),

('Valid Palindrome', 'Check if a string is a palindrome (ignoring non-alphanumeric characters).', 'strings',
'function isPalindrome(s) {
	const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
	let left = 0;
	let right = cleaned.length - 1;
	
	while (left < right) {
		if (cleaned[left] !== cleaned[right]) {
			return false;
		}
		left++;
		right--;
	}
	
	return true;
}', 12)

ON CONFLICT DO NOTHING;
