/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Response, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/global-exception.filter';
import { LibService } from './lib.service';

@UseFilters(HttpExceptionFilter)
@Controller('api/lib')
export class LibController {
  constructor(private readonly libService: LibService) {}
  @Get('/downloadLewacture/:licId')
  async downloadLewacture(@Param('licId') licId: string, @Response() res) {
    return res.status(200).json({
      result: await this.libService.downloadLewacture(parseInt(licId)),
    });
  }
}
