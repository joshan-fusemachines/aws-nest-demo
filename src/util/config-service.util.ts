import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import { AuthenticationSubscriber } from 'src/authentication/subscribers/authentication.subscriber';
import { SnakeNamingStrategy } from 'src/database/strategies/snake-naming.strategy';

export interface EnvironmentConfig {
  [key: string]: string;
}
export interface TypeOrmConfig {
  type: 'postgres';
  host: string;
  port: any;
  username: string;
  password: string;
  database: string;
  entities: string[]; // Adjust this based on your entity paths
  subscribers: any[]; // Adjust this based on your subscribers
  namingStrategy: any; // Adjust this based on your naming strategy
  synchronize: boolean;
  logging: boolean;
  extra: {
    charset: string;
  };
}

@Injectable()
export class ConfigService {
  private envConfig: EnvironmentConfig;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor() {
    const environmentFile = path.resolve(
      process.cwd(),
      `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
    );

    // Check if the environment file exists
    if (!fs.existsSync(environmentFile)) {
      throw new Error(`Environment file not found: ${environmentFile}`);
    }
    this.envConfig = dotenv.parse(fs.readFileSync(environmentFile));
  }
  ç;
  get(key: string): string {
    return this.envConfig[key];
  }

  getPort(): number {
    return parseInt(this.get('POSTGRES_PORT') || '3000', 10);
  }

  getTypeORMConfig(): TypeOrmConfig {
    return {
      type: 'postgres',
      host: this.get('POSTGRES_HOST'),
      port: this.get('POSTGRES_PORT') || 5432,
      username: this.get('POSTGRES_USER'),
      password: this.get('POSTGRES_PASSWORD'),
      database: this.get('POSTGRES_DB'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      subscribers: [AuthenticationSubscriber],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: this.get('SYNCRONIZE_DB') == 'true' ? true : false,
      logging: this.get('POSTGRES_LOG') == 'true' ? true : false,
      extra: { charset: 'utf8mb4_unicode_ci' },
    };
  }
}
