import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProfileModule } from 'src/profile/profile.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { FireBaseLoginService } from './firebase-login.service';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';

@Module({
  imports: [
    PassportModule,
    ProfileModule,
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    LocalStrategy,
    FireBaseLoginService,
    AzureServiceBusService
  ],
  controllers: [AuthController],
})
export class AuthModule {}
