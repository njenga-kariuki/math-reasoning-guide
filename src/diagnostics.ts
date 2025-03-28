// Add this temporary file to check imports
import * as expressValidator from 'express-validator';

console.log('Express Validator exports:', Object.keys(expressValidator));

// Try to import specific members
import { body, validationResult, checkSchema } from 'express-validator';

console.log('Direct imports available:');
console.log('body:', typeof body);
console.log('validationResult:', typeof validationResult);
console.log('checkSchema:', typeof checkSchema); 