export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  access_token: string;
}
