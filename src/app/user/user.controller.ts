/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Response,
  UseFilters,
} from '@nestjs/common';

import { HttpExceptionFilter } from 'src/filters/global-exception.filter';
import { UserService } from './user.service';
import { VRolunteeringRequest } from 'src/database/models/volunteeringRequest.model';
import { Year } from 'src/database/models/admin.model';
@UseFilters(HttpExceptionFilter)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/getMyProfile')
  async getMyProfile(@Request() req, @Response() res) {
    return res
      .status(200)
      .json({ result: await this.userService.getMyProfile(req.user) });
  }
  @Post('/update')
  async update(
    @Request() req,
    @Response() res,
    @Body()
    body: {
      Fname: string;
      Lname: string;
      year: Year;
      email: string;
    },
  ) {
    const user = await this.userService.update(
      req.user.id,
      body.Fname,
      body.Lname,
      body.year,
      body.email,
    );
    return res.status(200).json({ result: user });
  }

  @Post('/VRolunteeringRequest')
  async VRolunteeringRequest(
    @Body('VRolunteeringRequest') vRolunteeringRequest: VRolunteeringRequest,
    @Request() req,
    @Response() res,
  ) {
    const createVRolunteeringRequest = new VRolunteeringRequest(
      vRolunteeringRequest,
    );
    const userId = req.user.id;
    const newVRolunteeringRequest = await this.userService.VRolunteering(
      createVRolunteeringRequest.dataValues,
      userId,
    );
    return res.status(201).json({ result: newVRolunteeringRequest });
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
    const leactures = await this.userService.getLeacture(body);
    return res.status(200).json({ result: leactures });
  }
  @Post('/getSubjects')
  async getSubjects(
    @Body()
    body: {
      year: string;
      search: string;
    },
    @Response() res,
  ) {
    const subject = await this.userService.getSubjects(body.search, body.year);
    return res.status(200).json({ result: subject });
  }
  @Get('comments/:licId')
  async getComments(@Param('licId') licId: string, @Response() res) {
    const comments = await this.userService.getComments(parseInt(licId));
    return res.status(200).json({ result: comments });
  }
  @Post('addComment/:leactureId')
  async addComment(
    @Param('leactureId') leactureId: string,
    @Request()
    req,
    @Response() res,
    @Body()
    body: {
      content: string;
    },
  ) {
    const add = await this.userService.addComment(
      req.user.id,
      parseInt(leactureId),
      body.content,
    );
    return res.status(201).json({ result: add });
  }

  @Post('updateComment/:comId')
  async updateComment(
    @Param('comId') comId: string,
    @Request()
    req,
    @Response() res,
    @Body()
    body: {
      content: string;
    },
  ) {
    const update = await this.userService.updateComment(
      req.user.id,
      parseInt(comId),
      body.content,
    );
    return res.status(200).json({ result: update });
  }
  @Delete('deleteComment/:comId')
  async deleteComment(
    @Param('comId') comId: string,
    @Request()
    req,
    @Response() res,
  ) {
    const deleteComm = await this.userService.deleteComment(
      req.user.id,
      parseInt(comId),
    );
    return res.status(200).json({ result: deleteComm });
  }
  @Get('showReplas/:comId')
  async showReplas(@Param('comId') comId: string, @Response() res) {
    const replays = await this.userService.showReplas(parseInt(comId));
    return res.status(200).json({ result: replays });
  }
  @Post('replayOnComment/:comId')
  async replayOnComment(
    @Param('comId') comId: string,
    @Body('content') content: string,
    @Response() res,
    @Request() req,
  ) {
    const replays = await this.userService.replayOnComment(
      req.user.id,
      parseInt(comId),
      content,
    );

    return res.status(200).json({ result: replays });
  }
}
