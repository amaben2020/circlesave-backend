import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondMigration1755695160455 implements MigrationInterface {
    name = 'SecondMigration1755695160455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`transactions_histories\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('FUNDING', 'WITHDRAWAL') NOT NULL, \`status\` enum ('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING', \`amount\` decimal(12,2) NOT NULL, \`currency\` varchar(255) NOT NULL, \`balanceBefore\` int NOT NULL, \`balanceAfter\` int NOT NULL, \`transactionId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`transactions_histories\` ADD CONSTRAINT \`FK_cb8a58b9efdb7fac70ef72ed8f0\` FOREIGN KEY (\`transactionId\`) REFERENCES \`transactions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions_histories\` DROP FOREIGN KEY \`FK_cb8a58b9efdb7fac70ef72ed8f0\``);
        await queryRunner.query(`DROP TABLE \`transactions_histories\``);
    }

}
