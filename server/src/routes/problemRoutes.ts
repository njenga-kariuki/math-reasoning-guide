import express from 'express';
import { body, validationResult } from 'express-validator';
import * as problemController from '../controllers/problemController';

const router = express.Router();

// Validation middleware for problem creation
const validateProblem = [
  body('problem_id').notEmpty().withMessage('Problem ID is required'),
  body('problem_category').notEmpty().withMessage('Problem category is required')
    .isIn(['Algebra', 'Calculus', 'Geometry', 'Probability', 'Statistics', 'Number Theory', 'Combinatorics', 'Other'])
    .withMessage('Invalid problem category'),
  body('difficulty_level').notEmpty().withMessage('Difficulty level is required')
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Invalid difficulty level'),
  body('problem_text').notEmpty().withMessage('Problem text is required')
];

// Routes
router.route('/')
  .get(problemController.getProblems)
  .post(validateProblem, problemController.createProblem);

router.route('/random')
  .get(problemController.getRandomProblem);

router.route('/:id')
  .get(problemController.getProblem)
  .put(problemController.updateProblem);

router.route('/:id/discard')
  .put(problemController.discardProblem);

export default router;
