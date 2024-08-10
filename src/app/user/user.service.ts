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
import { Op } from 'sequelize';
import { Comments } from 'src/database/models/comments.model';
import { Leacture } from 'src/database/models/leacture.model';
import { Subject } from 'src/database/models/subject.model';
import { User } from 'src/database/models/user.model';
import { VRolunteeringRequest } from 'src/database/models/volunteeringRequest.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(VRolunteeringRequest)
    private VRolunteeringRequestModel: typeof VRolunteeringRequest,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Leacture)
    private readonly leactureModel: typeof Leacture,
    @InjectModel(Subject)
    private readonly subjectModel: typeof Subject,
    @InjectModel(Comments)
    private readonly commentsModel: typeof Comments,
    private readonly jwtService: JwtService,
  ) {}
  async getMyProfile(user) {
    return user;
  }

  async update(userId, Fname, Lname, year, email) {
    const user = await this.userModel.findByPk(userId);
    user.Fname = Fname ? Fname : user.Fname;
    user.Lname = Lname ? Lname : user.Lname;
    user.year = year ? year : user.year;
    user.email = email ? email : user.email;
    await user.save();
    return user;
  }

  async VRolunteering(
    vRolunteeringRequest: VRolunteeringRequest,
    userId,
  ): Promise<{ vRolunteeringRequest: VRolunteeringRequest }> {
    const validationErrors = await validate(
      new VRolunteeringRequest(vRolunteeringRequest),
    );

    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.map((error) =>
        Object.values(error.constraints),
      );
      throw new BadRequestException(errorMessages);
    }
    const isExist = await VRolunteeringRequest.findOne({
      where: { FullName: vRolunteeringRequest.FullName },
    });
    if (isExist) {
      throw new BadRequestException('there one is exist');
    }
    vRolunteeringRequest.userId = userId;
    const newvRolunteeringRequest =
      await this.VRolunteeringRequestModel.create(vRolunteeringRequest);

    return { vRolunteeringRequest: newvRolunteeringRequest };
  }
  async getLeacture(filter) {
    const { year, date, subject, withArchived } = filter;
    const where: any = {};
    if (year) {
      where.year = year;
    }
    if (date) {
      const startDate = new Date(`${date}-01-01`);
      const endDate = new Date(`${date}-12-31`);
      where.date = { [Op.between]: [startDate, endDate] };
    }
    if (subject) {
      where.subject = subject;
    }
    if (withArchived) {
      where.isArchived = 1;
    }
    const leactures = await this.leactureModel.findAll({ where });
    if (!leactures) {
      throw new NotFoundException(
        'there is no leacture accourding this leacture',
      );
    }
    return leactures;
  }
  async getSubjects(search?: string, year?: any) {
    const where: any = {};

    if (search) {
      where.subject = { [Op.like]: `%${search}%` };
    }
    if (year) {
      where.year = year;
    }

    return await this.subjectModel.findAll({ where });
  }

  async getComments(lecId) {
    const comments = await this.commentsModel.findAll({
      where: { leactureId: lecId },
      include: [
        { model: User, as: 'user', attributes: ['Fname', 'Lname', 'id'] },
      ],
    });
    return comments;
  }
  async addComment(userId, lecId, content) {
    const newComment = new Comments({
      content: content,
      userId: userId,
    });

    const validationErrors = await validate(newComment);
    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.map((error) => {
        Object.values(error.constraints);
      });
      throw new BadRequestException(errorMessage);
    }
    const leacture = await this.leactureModel.findByPk(lecId);
    if (!leacture) {
      throw new NotFoundException('the leacture isnt found');
    }
    const comment = await this.commentsModel.create({
      content: content,
      userId: userId,
      leactureId: lecId,
    });
    return comment;
  }
  async updateComment(userId, comId, content) {
    if (!content) {
      throw new BadRequestException('content is require');
    }
    const comment = await this.commentsModel.findByPk(comId);
    if (!comment) {
      throw new NotFoundException('the commented was been deleted');
    }
    if (userId != comment.userId) {
      throw new UnauthorizedException('this isnt yours');
    }
    comment.content = content;
    comment.save();
    return comment;
  }
  async deleteComment(userId, comId) {
    const comment = await this.commentsModel.findByPk(comId);
    if (!comment) {
      throw new NotFoundException('the commented was been deleted');
    }
    if (userId != comment.userId) {
      throw new UnauthorizedException('this isnt yours');
    }
    comment.destroy();
    return true;
  }
  async replayOnComment(userId, comId, content) {
    
    const parentComment = await this.commentsModel.findByPk(comId);
    if (!parentComment) {
      throw new NotFoundException('parent comment is`nt found');
    }
    const Comment = new Comments({
      content: content,
      userId: userId,
    });

    const validationErrors = await validate(Comment);
    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.map((error) => {
        Object.values(error.constraints);
      });
      throw new BadRequestException(errorMessage);
    }

    const comment = await this.commentsModel.create({
      content: content,
      userId: userId,
      parentId: comId,
    });
    return comment;
  }
  async showReplas(comId) {
    const comments = await this.commentsModel.findAll({
      where: { parentId: comId },
      include: [
        { model: User, as: 'user', attributes: ['Fname', 'Lname', 'id'] },
        { model: Comments, as: 'replies' },
      ],
    });
    return comments;
  }
}
