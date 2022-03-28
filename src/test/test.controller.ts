import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  get() {
    return {
      message: 'NestJS rocks!',
    };
  }
}
