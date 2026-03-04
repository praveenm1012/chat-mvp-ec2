import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chat_id: string;

  @Column()
  user_id: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
