import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client/extension";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  onModuleDestroy() {}
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks() {
    await this.$disconnect();
  }
}
