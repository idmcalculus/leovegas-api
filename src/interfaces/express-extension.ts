import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  access_token?: string;
}

// Extend the Express Request interface
export interface RequestWithUser extends Request {
  user: User;
}
