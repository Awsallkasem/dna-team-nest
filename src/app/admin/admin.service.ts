/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { validate } from 'class-validator';
import { writeFile } from 'fs';
import { Leacture } from 'src/database/models/leacture.model';
import { User, UserRole } from 'src/database/models/user.model';
import { promisify } from 'util';
import * as fs from 'fs';
import { NotificationsService } from '../notification/notification.service';
import { Year } from 'src/database/models/admin.model';
import { Subject } from 'src/database/models/subject.model';

const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Leacture)
    private LeactureModel: typeof Leacture,
    @InjectModel(Subject)
    private readonly subjectModel: typeof Subject,
    private readonly jwtService: JwtService,
  ) {}

  async addSubject(subjectData: { subject: string; year: any }) {
    return await this.subjectModel.create(subjectData);
  }
  async updateSubject(subjectTitle, subId) {
    const subject = await this.subjectModel.findByPk(subId);
    if (!subject) {
      throw new NotFoundException('the subject is`t found');
    }
    subject.subject = subjectTitle;
    subject.save();
    return subject;
  }

  async deleteSubject(subId) {
    const subject = await this.subjectModel.findByPk(subId);
    if (!subject) {
      throw new NotFoundException('the subject is`t found');
    }
    subject.destroy();
    return true;
  }

  async uploadLeacture(
    file: Express.Multer.File,
    year,
    subId,
    isArchived,
    date,
    userId,
  ) {
    const validationErrors = await validate(
      new Leacture({
        leactureName: file.originalname,
        subId: subId,
        year: year,
      }),
    );
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.map((error) =>
        Object.values(error.constraints),
      );
      throw new BadRequestException(errorMessages);
    }
    const subject = (await this.subjectModel.findByPk(subId)).subject;

    const uploadPath = `./public/uploads/${year}/${subject}`;
    await fs.promises.mkdir(uploadPath, { recursive: true });
    const filename = `file_${Date.now()}.pdf`;
    const filePath = `${uploadPath}/${filename}`;
    await writeFileAsync(filePath, file.buffer);
    let path = filePath.replace('./public', '').replace(/\\/g, '/');

    const newLeacture = this.LeactureModel.create({
      leactureName: filename,
      subject: subject,
      path: path,
      isArchived: isArchived ? true : false,
      subId: subId,
      year: year,
      publishedId: userId,
      date: new Date(date),
    });
    return newLeacture;
  }
  async updateLeacture(
    file: Express.Multer.File,
    year,
    subId,
    isArchived,
    date,
    lictureId,
    user,
  ) {
    const oldLicture = await this.LeactureModel.findByPk(lictureId);
    if (!oldLicture) {
      throw new NotFoundException('the licture isnt found');
    }
    if (user.id != oldLicture.publishedId && user.role != UserRole.SUPERADMIN) {
      throw new UnauthorizedException('you dont have a premaicon to this ');
    }
    let subject = null;
    if (subId) {
      subject = (await this.subjectModel.findByPk(subId)).subject;
    }
    if (file) {
      await unlinkAsync(oldLicture.path).catch((err) =>
        console.warn('Failed to delete old file:', err),
      );

      const uploadPath = `./public/uploads/${year ? year : oldLicture.year}/${subject ? subject : oldLicture.subject}`;
      await fs.promises.mkdir(uploadPath, { recursive: true });
      const filename = `file_${Date.now()}.pdf`;
      const filePath = `${uploadPath}/${filename}`;
      await writeFileAsync(filePath, file.buffer);

      let path = filePath.replace('./public', '').replace(/\\/g, '/');
      oldLicture.path = path;
    }
    oldLicture.year = year ? year : oldLicture.year;
    oldLicture.isArchived = isArchived ? isArchived : oldLicture.isArchived;
    oldLicture.date = date ? new Date(date) : oldLicture.date;
    oldLicture.subject = subject ? subject : oldLicture.subject;

    oldLicture.save();

    return oldLicture;
  }

  async deletLeacture(leactureId, user) {
    const oldleacture = await this.LeactureModel.findByPk(leactureId);
    if (!oldleacture) {
      throw new NotFoundException('the leactureId isnt found');
    }
    if (
      user.id != oldleacture.publishedId &&
      user.role != UserRole.SUPERADMIN
    ) {
      throw new UnauthorizedException('you dont have a premaicon to this ');
    }
    await unlinkAsync(oldleacture.path).catch((err) =>
      console.warn('Failed to delete old file:', err),
    );
    oldleacture.destroy();

    return true;
  }
}
