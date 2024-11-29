export interface User {
  id: number;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  created_at?: Date;
  updated_at?: Date;
}

export interface UserWithPassword extends User {
  password: string;
} 