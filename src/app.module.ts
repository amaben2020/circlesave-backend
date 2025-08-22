/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { paystackConfig } from 'db/config/paystackConfig';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionHistoryModule } from './transaction-history/transaction-history.module';
import { GroupMembersModule } from './group-members/group-members.module';
import databaseConfig from 'db/config/database';
import appConfig from 'db/config/appConfig';

const ENV = process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV ? `.env.${ENV}` : '.env',
      load: [appConfig, databaseConfig, paystackConfig],
      // validationSchema: ENV === 'test' ? undefined : enviromentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host')!,
        port: configService.get('database.port')!,
        username: configService.get('database.username')!,
        password: configService.get('database.password')!,
        database: configService.get('database.name')!,
        synchronize: configService.get('database.synchronize')!,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], // This will load all .entity.ts files
        // or be explicit:
        // entities: [User]
      }),
    }),
    UserModule,
    PaymentsModule,
    WalletModule,
    TransactionModule,
    TransactionHistoryModule,
    GroupMembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
