export interface CreateUser {
  clerk_id: string;
  name: string | undefined;
  email: string | undefined;
}

export interface User {
  id: number;
}
