-- Add FizzBuzz problem to the database
INSERT INTO problems (title, description, category, solution_code, estimated_time_minutes) VALUES
(
  'FizzBuzz',
  'Write a function that prints the numbers 1 to 100. But for multiples of three print "Fizz" instead of the number and for multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".',
  'loops',
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
}',
  8
) ON CONFLICT DO NOTHING;
