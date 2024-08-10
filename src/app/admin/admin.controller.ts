/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  Response,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';

import { HttpExceptionFilter } from 'src/filters/global-exception.filter';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Import Express namespace
import { Year } from 'src/database/models/admin.model';

@UseFilters(HttpExceptionFilter)
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('/addSubject')
  async addSubject(
    @Body('subject') subject: string,
    @Request() req,
    @Response() res,
  ) {
    const year = req.user.year;
    return res
      .status(201)
      .json({ subject: await this.adminService.addSubject({ subject, year }) });
  }
  @Post('/updateSubject/:subId')
  async updateSubject(
    @Body('subject') subject: string,
    @Param('subId') subId: string,
    @Response() res,
  ) {
    return res.status(200).json({
      subject: await this.adminService.updateSubject(subject, parseInt(subId)),
    });
  }

  @Delete('/deleteSubject/:subId')
  async deletSubject(@Param('subId') subId: string, @Response() res) {
    return res.status(200).json({
      subject: await this.adminService.deleteSubject(parseInt(subId)),
    });
  }
  @Post('uploadLicture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLicture(
    @UploadedFile('file') file: Express.Multer.File,
    @Body('year') year: string,
    @Body('subId') subId: number,
    @Body('isArchived') isArchived: boolean,
    @Body('date') date: string,
    @Response() res,
    @Request() req,
  ) {
    const userId = req.user.id;

    const newLeacture = await this.adminService.uploadLeacture(
      file,
      year,
      subId,
      isArchived,
      date,
      userId,
    );
    return res.status(201).json({ leacture: newLeacture });
  }
  @Post('updateLicture/:leactureId')
  @UseInterceptors(FileInterceptor('file'))
  async updateLicture(
    @UploadedFile() file: Express.Multer.File,
    @Body('year') year: string,
    @Body('subId') subId: number,
    @Body('isArchived') isArchived: boolean,
    @Body('date') date: string,
    @Param('leactureId') leactureId: string,
    @Response() res,
    @Request() req,
  ) {
    const updatedLicture = await this.adminService.updateLeacture(
      file,
      year,
      subId,
      isArchived,
      date,
      parseInt(leactureId),
      req.user,
    );
    return res.status(200).json({ leacture: updatedLicture });
  }
  @Delete('deleteLicture/:leactureId')
  async deleteLicture(
    @Param('leactureId') leactureId: string,
    @Response() res,
    @Request() req,
  ) {
    await this.adminService.deletLeacture(parseInt(leactureId), req.user);
    return res.status(200).json({ isDeleted: true });
  }
  
}
