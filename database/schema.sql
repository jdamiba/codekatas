-- CodeKatas Database Schema
-- Run this script to initialize your Neon Postgres database

-- Users table (extends Clerk data)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferred_language VARCHAR(50) DEFAULT 'javascript'
);

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  solution_code TEXT NOT NULL,
  language VARCHAR(50) DEFAULT 'javascript',
  estimated_time_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Character-level attempt tracking
CREATE TABLE IF NOT EXISTS attempt_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_characters INTEGER DEFAULT 0,
  correct_characters INTEGER DEFAULT 0,
  total_errors INTEGER DEFAULT 0,
  session_duration_seconds INTEGER,
  accuracy_percentage DECIMAL(5,2),
  characters_per_minute INTEGER,
  is_completed BOOLEAN DEFAULT FALSE
);

-- Character-level keystroke tracking
CREATE TABLE IF NOT EXISTS keystroke_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES attempt_sessions(id) ON DELETE CASCADE,
  character_position INTEGER NOT NULL,
  typed_character CHAR(1),
  expected_character CHAR(1),
  is_correct BOOLEAN NOT NULL,
  timestamp_ms BIGINT NOT NULL,
  time_since_last_keystroke_ms INTEGER
);

-- User progress and streaks
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  best_accuracy DECIMAL(5,2) DEFAULT 0,
  best_wpm INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  average_time_seconds INTEGER,
  mastery_level INTEGER DEFAULT 0,
  last_attempted TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- Daily streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  streak_start_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  criteria JSONB,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Leaderboards
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  rank_position INTEGER,
  period VARCHAR(20) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, metric_type, period)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(category);
CREATE INDEX IF NOT EXISTS idx_attempt_sessions_user_id ON attempt_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_attempt_sessions_problem_id ON attempt_sessions(problem_id);
CREATE INDEX IF NOT EXISTS idx_keystroke_events_session_id ON keystroke_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_metric_period ON leaderboard_entries(metric_type, period, rank_position);

-- Sample achievements
INSERT INTO achievements (name, description, icon, criteria, points) VALUES
('First Steps', 'Complete your first coding kata', '🎯', '{"type": "first_completion"}', 10),
('Speed Demon', 'Achieve 100+ characters per minute', '⚡', '{"type": "speed_threshold", "value": 100}', 25),
('Accuracy Master', 'Achieve 95%+ accuracy on any problem', '🎯', '{"type": "accuracy_threshold", "value": 95}', 20),
('Streak Starter', 'Maintain a 3-day practice streak', '🔥', '{"type": "streak_threshold", "value": 3}', 15),
('Week Warrior', 'Maintain a 7-day practice streak', '💪', '{"type": "streak_threshold", "value": 7}', 50),
('Month Master', 'Maintain a 30-day practice streak', '👑', '{"type": "streak_threshold", "value": 30}', 200),
('Problem Solver', 'Complete 10 different problems', '🧩', '{"type": "problem_count", "value": 10}', 30),
('Code Master', 'Complete 50 different problems', '🏆', '{"type": "problem_count", "value": 50}', 150),
('Perfect Score', 'Complete a problem with 100% accuracy', '💯', '{"type": "perfect_accuracy"}', 40),
('Daily Grind', 'Practice for 5 consecutive days', '📅', '{"type": "consecutive_days", "value": 5}', 35)
ON CONFLICT DO NOTHING;

-- Sample problems (JavaScript)
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
}', 15),

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
}', 12),

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

('Maximum Subarray', 'Find the contiguous subarray with the largest sum.', 'arrays',
'function maxSubArray(nums) {
	let maxSum = nums[0];
	let currentSum = nums[0];
	
	for (let i = 1; i < nums.length; i++) {
		currentSum = Math.max(nums[i], currentSum + nums[i]);
		maxSum = Math.max(maxSum, currentSum);
	}
	
	return maxSum;
}', 18),

('Binary Search', 'Search for a target value in a sorted array.', 'arrays',
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
}', 10)
ON CONFLICT DO NOTHING;
