import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('chat_members')
export class ChatMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chat_id: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;
}
