import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import * as annotationController from '../controllers/annotationController';

const router = express.Router();

// Validation middleware for guidance submission
const validateGuidance = [
  body('error_index').isNumeric().withMessage('Error index must be a number'),
  body('error_step_content').notEmpty().withMessage('Error step content is required'),
  body('error_type').notEmpty().withMessage('Error type is required')
    .isIn([
      'calculation_error',
      'conceptual_misunderstanding',
      'approach_selection_error',
      'logical_reasoning_error',
      'domain_constraint_error',
      'formula_application_error',
      'notation_error',
      'other_error'
    ])
    .withMessage('Invalid error type'),
  body('guidance_provided').notEmpty().withMessage('Guidance is required'),
  body('guidance_type').notEmpty().withMessage('Guidance type is required')
    .isIn([
      'calculation_correction',
      'concept_clarification',
      'approach_redirection',
      'logical_flow_correction',
      'domain_reminder',
      'formula_clarification',
      'direct_correction',
      'other_correction'
    ])
    .withMessage('Invalid guidance type')
];

// Routes
router.route('/')
  .get(annotationController.getAnnotations);

router.route('/start')
  .post(annotationController.startAnnotation);

router.route('/:id')
  .get(annotationController.getAnnotation);

router.route('/:id/guidance')
  .post(validateGuidance, annotationController.submitGuidance);

router.route('/:id/mark-correct')
  .post(annotationController.markAsCorrect);

router.route('/discard')
  .post(annotationController.discardProblem);

export default router;
