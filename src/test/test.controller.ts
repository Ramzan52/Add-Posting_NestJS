import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
@ApiTags('test')
@Controller('test')
export class TestController {
  @Get()
  get() {
    return {
      message: 'NestJS rocks!',
    };
  }
}
