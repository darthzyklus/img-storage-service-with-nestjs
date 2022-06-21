import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [ConfigModule.forRoot(), StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
