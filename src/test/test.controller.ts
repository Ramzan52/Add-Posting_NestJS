import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth-guards';

@ApiTags('test')
@Controller('test')
export class TestController {
  @Get()
  test() {
    return {
      message: 'NestJS rocks!',
    };
  }

  @Get('secure')
  @UseGuards(JwtAuthGuard)
  secureTest() {
    return {
      message: 'NestJS rocks!',
    };
  }
}
