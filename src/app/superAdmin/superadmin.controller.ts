/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Response,
  UseFilters,
} from '@nestjs/common';

import { HttpExceptionFilter } from 'src/filters/global-exception.filter';
import { SuperAdminService } from './superadmin.service';
import { User } from 'src/database/models/user.model';
@UseFilters(HttpExceptionFilter)
@Controller('api/superAdmin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('/getAllUser')
  async getAllUser(@Response() res) {
    return res
      .status(200)
      .json({ result: await this.superAdminService.getAllUser() });
  }
  @Get('/getUserDeatails/:id')
  async getUserDeatails(@Response() res, @Param('id') id: string) {
    return res.status(200).json({
      result: await this.superAdminService.getUserDeatails(parseInt(id)),
    });
  }

  @Get('/getAllTeamMember')
  async getAllTeamMember(@Response() res) {
    return res
      .status(200)
      .json({ result: await this.superAdminService.getAllTeamMember() });
  }

  @Get('/getAllAdmin')
  async getAllAdmin(@Response() res) {
    return res
      .status(200)
      .json({ result: await this.superAdminService.getAllAdmin() });
  }

  @Get('/showAllVRolunteeringRequest')
  async showAllVRolunteeringRequest(@Response() res) {
    return res.status(200).json({
      result: await this.superAdminService.showAllVRolunteeringRequest(),
    });
  }
  @Get('/showVRolunteeringRequestById/:id')
  async showVRolunteeringRequestById(@Response() res, @Param('id') id: string) {
    return res.status(200).json({
      result: await this.superAdminService.showVRolunteeringRequestById(
        parseInt(id),
      ),
    });
  }
  @Post('/acceptVRolunteeringRequest/:id')
  async acceptVRolunteeringRequest(@Response() res, @Param('id') id: string) {
    return res.status(200).json({
      result: await this.superAdminService.acceptVRolunteeringRequest(
        parseInt(id),
      ),
    });
  }
  @Post('/addLib')
  async addLib(@Body('lib') lib: User, @Response() res) {
    const createLib = new User(lib);

    const newLib = await this.superAdminService.AddLib(createLib.dataValues);
    return res.status(201).json({ result: 'lib registered successfully' });
  }
  @Post('/updateUserDetails/:teamMembarId')
  async updateUserDetails(
    @Param('teamMembarId') teamMembarId: string,
    @Response() res,
    @Body('massion') massion: string,
  ) {
    return res.status(200).json({
      result: await this.superAdminService.updateUserDetails(
        parseInt(teamMembarId),
        massion,
      ),
    });
  }
  @Post('deacreaseRole/:userId')
  async deacreaseRole(@Param('userId') userId: string, @Response() res) {
    return res.status(200).json({
      result: await this.superAdminService.deacreaseRole(parseInt(userId)),
    });
  }

  @Post('updateRole/:userId')
  async updateRole(@Param('userId') userId: string, @Response() res) {
    return res.status(200).json({
      result: await this.superAdminService.updateRole(parseInt(userId)),
    });
  }
  @Post('/getLeacture')
  async getLeacture(
    @Body()
    body: {
      year: string;
      subject: string;
      withArchived: boolean;
      date: string;
    },
    @Response() res,
  ) {
    const leactures = await this.superAdminService.getLeacture(body);
    return res.status(200).json({ result: leactures });
  }
  @Post('numberOfDownloads')
  async numberOfDownloads(@Body('year') year: string, @Response() res) {
    return res
      .status(200)
      .json({ result:await this.superAdminService.numberOfDownloads(year) });
  }
}
