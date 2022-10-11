import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { BusinessProcessModule } from './business-process/business-process.module';
import { ClassificationRuleModule } from './classification-rule/classification-rule.module';
import { BusinessRuleModule } from './business-rule/business-rule.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    FileModule,
    BusinessProcessModule,
    ClassificationRuleModule,
    BusinessRuleModule,
    TaskModule,
  ],
})
export class AppModule {}
