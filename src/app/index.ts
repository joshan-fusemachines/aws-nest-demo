import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/authentication';
import { DatabaseModule } from 'src/database';
import { UserModule } from 'src/user';

@Module({
  imports: [DatabaseModule, AuthenticationModule, UserModule],
})
export class AppModule {}
