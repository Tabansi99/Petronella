import { Migration } from '@mikro-orm/migrations';

export class Migration20211106040430 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "name" to "userName";');
    this.addSql('alter table "user" add column "email" text not null, add column "password" text not null, add column "firstName" text not null, add column "lastName" text not null;');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_userName_unique" unique ("userName");');

    this.addSql('create table "destination" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "city" text not null, "region" text not null, "country" text not null, "continent" text not null, "longitude" numeric not null, "latitude" numeric not null);');
    this.addSql('alter table "destination" add constraint "destination_city_region_country_unique" unique ("city", "region", "country");');

    this.addSql('create table "flight" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "user" bigint not null, "flightDate" date null, "departureCity" text not null, "arrivalCity" text not null, "destination" bigint not null);');
    this.addSql('alter table "flight" add constraint "flight_user_foreign" foreign key ("user") references "user" ("id") on update cascade;');
    this.addSql('alter table "flight" add constraint "flight_destination_foreign" foreign key ("destination") references "destination" ("id") on update cascade;');
  }
}
