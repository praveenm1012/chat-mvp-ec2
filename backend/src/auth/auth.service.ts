import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ id: string; email: string; created_at: Date }> {
    const { email, password } = registerDto;
    this.logger.log(`Register attempt for email: ${email}`);

    try {
      const existing = await this.userRepository.findOne({ where: { email } });
      if (existing) {
        this.logger.warn(`Registration failed — email already in use: ${email}`);
        throw new ConflictException('Email already in use');
      }

      const password_hash = await bcrypt.hash(password, this.SALT_ROUNDS);
      const user = this.userRepository.create({ email, password_hash });
      const saved = await this.userRepository.save(user);
      this.logger.log(`User registered successfully: ${saved.id}`);

      return {
        id: saved.id,
        email: saved.email,
        created_at: saved.created_at,
      };
    } catch (err) {
      if (err instanceof ConflictException) throw err;
      this.logger.error(`Unexpected error during registration for ${email}`, err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    this.logger.log(`Login attempt for email: ${email}`);

    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        this.logger.warn(`Login failed — user not found: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordValid = await bcrypt.compare(password, user.password_hash);
      if (!passwordValid) {
        this.logger.warn(`Login failed — invalid password for: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email };
      const access_token = this.jwtService.sign(payload);
      this.logger.log(`Login successful for user: ${user.id}`);

      return { access_token };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.error(`Unexpected error during login for ${email}`, err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (err) {
      this.logger.error(`Error finding user by email: ${email}`, err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (err) {
      this.logger.error(`Error finding user by id: ${id}`, err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }
}
