import { useEffect, useState } from 'react';
import { ZodError, type ZodSchema } from 'zod';

export function useValidation(data: unknown, schema: ZodSchema) {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const validation = schema.safeParse(data);
      if (!validation.success) {
        setIsError(true);
        throw new ZodError(validation.error.issues);
      } else {
        setIsValid(true);
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.error('Zod Error validating people data:', error.issues);
      } else if (error instanceof Error) {
        console.error('Error validating people data', error.message);
      } else {
        console.error('Unknown error validating people data', error);
      }
    }
  }, [data, schema]);

  return { isValid, isError };
}
