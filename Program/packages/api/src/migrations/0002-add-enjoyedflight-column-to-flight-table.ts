import { Migration } from '@mikro-orm/migrations';

export class Migration20211130011500 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "flight" add column "enjoyedFlight" text null;');
  }
}
