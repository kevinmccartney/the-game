import { User } from './user';

export type Point = {
  created_by: User;
  created_time: string;
  points: number;
  reason: string;
  subject: string;
  id: string;
};
