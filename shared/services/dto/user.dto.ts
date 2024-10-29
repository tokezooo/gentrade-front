export interface CreateUserDto {
  clerk_id: string;
  name: string | undefined;
  email: string | undefined;
}

export interface UserDTO {
  id: number;
}
