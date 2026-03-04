import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateChatMemberTable20260304221608 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chat_members',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          
          {
            name: 'id',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          
          {
            name: 'chat_id',
            type: 'varchar',
            isNullable: false,
            
          },
          
          {
            name: 'user_id',
            type: 'varchar',
            isNullable: false,
            
          },
          
          {
            name: 'joined_at',
            type: 'varchar',
            isNullable: false,
            
          },
          
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chat_members');
  }
}