import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { NODE_ENV } from 'src/app/constants';
import { AuthenticationSubscriber } from 'src/authentication/subscribers';
import { SnakeNamingStrategy } from './strategies';
// Use the custom environment file based on the NODE_ENV
const environmentFile = path.resolve(
  process.cwd(),
  `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
);

// Check if the environment file exists
if (!fs.existsSync(environmentFile)) {
  throw new Error(`Environment file not found: ${environmentFile}`);
}
export const config = dotenv.parse(fs.readFileSync(environmentFile));
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.POSTGRES_HOST,
      port: parseInt(config.POSTGRES_PORT, 10),
      username: config.POSTGRES_USER,
      password: config.POSTGRES_PASSWORD,
      database: config.POSTGRES_DB,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      subscribers: [AuthenticationSubscriber],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: config.NODE_ENV !== NODE_ENV.PRODUCTION ? true : false,
      logging: config.NODE_ENV !== NODE_ENV.PRODUCTION ? true : false,
      extra: { charset: 'utf8mb4_unicode_ci' },
    }),
  ],
})
export class DatabaseModule {}
