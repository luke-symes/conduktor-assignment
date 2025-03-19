import { z } from 'zod';

export const zPerson = z.object({
  _id: z.string(),
  name: z.string(),
  dob: z.string().date(),
  address: z.object({
    street: z.string(),
    town: z.string(),
    postode: z.string(),
  }),
  telephone: z.string(),
  pets: z.array(z.string()),
  score: z.number(),
  email: z.string(),
  url: z.string().url(),
  description: z.string(),
  verified: z.boolean(),
  salary: z.number(),
});

export const zPeople = z.array(zPerson);

export const zPersonPicked = zPerson.pick({
  name: true,
  dob: true,
  email: true,
  verified: true,
  salary: true,
});

export const zPersonKey = zPerson.keyof();
export const zPersonPickedKey = zPersonPicked.keyof();

export type Person = z.infer<typeof zPerson>;
export type People = z.infer<typeof zPeople>;
export type PersonKey = z.infer<typeof zPersonKey>;
export type PersonPickedKey = z.infer<typeof zPersonPickedKey>;
