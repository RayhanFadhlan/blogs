import { MigrationInterface, QueryRunner } from "typeorm";

export class Blogs1736598423396 implements MigrationInterface {
    name = 'Blogs1736598423396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "content" text NOT NULL, "thumbnail" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_tags" ("blog_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_561e9296a2ba753a9900831104c" PRIMARY KEY ("blog_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_20ce3565a4dda1ce7a3e8104f2" ON "blog_tags" ("blog_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7d8cc813269fa2a0ec3f857187" ON "blog_tags" ("tag_id") `);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_50205032574e0b039d655f6cfd3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_20ce3565a4dda1ce7a3e8104f2a" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_20ce3565a4dda1ce7a3e8104f2a"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_50205032574e0b039d655f6cfd3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d8cc813269fa2a0ec3f857187"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20ce3565a4dda1ce7a3e8104f2"`);
        await queryRunner.query(`DROP TABLE "blog_tags"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
