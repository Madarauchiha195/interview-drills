// api/middlewares/validate.js

/**
 * Middleware factory for validating request data against a Zod schema
 * @param {Object} schema - Zod schema to validate against
 * @param {string} source - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[source]);
      
      if (!result.success) {
        // Format Zod errors into a more readable format
        const formattedErrors = result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors
        });
      }
      
      // Replace the request data with the validated data
      req[source] = result.data;
      next();
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({ error: 'Internal server error during validation' });
    }
  };
}