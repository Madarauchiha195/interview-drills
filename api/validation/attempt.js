// api/validation/attempt.js
import { z } from 'zod';

// Schema for validating attempt submission
export const submitAttemptSchema = z.object({
  drillId: z.string({
    required_error: "Drill ID is required",
    invalid_type_error: "Drill ID must be a string"
  }).min(1, "Drill ID cannot be empty"),
  
  answers: z.record(z.string(), {
    required_error: "Answers are required",
    invalid_type_error: "Answers must be an object with question IDs as keys and answer choices as values"
  }),
  
  timeSpent: z.number({
    required_error: "Time spent is required",
    invalid_type_error: "Time spent must be a number"
  }).int("Time spent must be an integer").min(0, "Time spent cannot be negative")
});

// Schema for validating attempt ID
export const attemptIdSchema = z.object({
  id: z.string({
    required_error: "Attempt ID is required",
    invalid_type_error: "Attempt ID must be a string"
  }).min(1, "Attempt ID cannot be empty")
});