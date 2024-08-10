/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NumberOfDownloads } from 'src/database/models/numberOfDownloads.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LibService {
  constructor(
    @InjectModel(NumberOfDownloads)
    private numberOfDownloadsmodele: typeof NumberOfDownloads,
    private readonly jwtService: JwtService,
  ) {}
  async downloadLewacture(lecId) {
    return await this.numberOfDownloadsmodele.create({
      leactureId: lecId,
      date: new Date(),
      amount: 1,
    });
  }
}
