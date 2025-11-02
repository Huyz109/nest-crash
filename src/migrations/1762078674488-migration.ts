import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762078674488 implements MigrationInterface {
    name = 'Migration1762078674488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "topic" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "userId" integer, "topicId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "nameCode" character varying(6) NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "UQ_de89ee162afecf4e85303f3a39d" UNIQUE ("nameCode"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id")); COMMENT ON COLUMN "permission"."name" IS 'Permission name'; COMMENT ON COLUMN "permission"."createdAt" IS 'Creation time'; COMMENT ON COLUMN "permission"."updatedAt" IS 'Last update time'`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")); COMMENT ON COLUMN "user"."createdAt" IS 'Creation time'; COMMENT ON COLUMN "user"."updatedAt" IS 'Last update time'`);
        await queryRunner.query(`CREATE TABLE "user_permissions" ("userId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_4d0e283b03781d1796e62dc6195" PRIMARY KEY ("userId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f05ccc7935f14874d7f89ba030" ON "user_permissions" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf38f85e52ee274ba9a01901ed" ON "user_permissions" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_b57a5333a16e092c662bd8ff5fe" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_permissions" ADD CONSTRAINT "FK_f05ccc7935f14874d7f89ba030f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_permissions" ADD CONSTRAINT "FK_cf38f85e52ee274ba9a01901ed2" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`INSERT INTO "permission"("name", "nameCode", "description") VALUES ('CREATE_USER', '5001', 'Permission to create a new user'), ('UPDATE_USER', '5002', 'Permission to update a user'), ('DELETE_USER', '5003', 'Permission to delete a user'), ('VIEW_USER', '5004', 'Permission to view user information')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_cf38f85e52ee274ba9a01901ed2"`);
        await queryRunner.query(`ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_f05ccc7935f14874d7f89ba030f"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_b57a5333a16e092c662bd8ff5fe"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf38f85e52ee274ba9a01901ed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f05ccc7935f14874d7f89ba030"`);
        await queryRunner.query(`DROP TABLE "user_permissions"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "topic"`);
    }

}
