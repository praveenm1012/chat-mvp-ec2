import apiClient from './client';
import type { User, CreateUserDto, LoginResponseDto } from '../types/auth.types';

export async function register(data: CreateUserDto): Promise<User> {
  try {
    const response = await apiClient.post<User>('/auth/register', data);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function login(data: CreateUserDto): Promise<LoginResponseDto> {
  try {
    const response = await apiClient.post<LoginResponseDto>('/auth/login', data);
    return response.data;
  } catch (err) {
    throw err;
  }
}
