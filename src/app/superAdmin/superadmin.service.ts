/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from 'src/database/models/admin.model';
import { TeamMember } from 'src/database/models/teamMember.model';
import { User, UserRole } from 'src/database/models/user.model';
import { VRolunteeringRequest } from 'src/database/models/volunteeringRequest.model';
import { EmailService } from '../email/email.service';
import { validate } from 'class-validator';
import { hash } from 'bcryptjs';
import { Leacture } from 'src/database/models/leacture.model';
import { Op, Sequelize } from 'sequelize'; // Import Sequelize and Op

import { NumberOfDownloads } from 'src/database/models/numberOfDownloads.model';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(TeamMember)
    private TeamMemberModel: typeof TeamMember,
    @InjectModel(VRolunteeringRequest)
    private VRolunteeringRequestModel: typeof VRolunteeringRequest,
    @InjectModel(Leacture)
    private leactureModel: typeof Leacture,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
  async getAllUser() {
    return await this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }
  async getAllTeamMember() {
    const teamMembers = await this.userModel.findAll({
      where: { role: UserRole.TEAMMEMBAR },
      include: [TeamMember],
      attributes: { exclude: ['password'] },
    });
    if (!teamMembers) {
      throw new NotFoundException('there no team member found');
    }
    return teamMembers;
  }

  async getAllAdmin() {
    const admin = await this.userModel.findAll({
      where: { role: UserRole.ADMIN },
      include: [Admin],
      attributes: { exclude: ['password'] },
    });
    if (!admin) {
      throw new NotFoundException('there no admin found');
    }
    return admin;
  }
  async getUserDeatails(userId) {
    const user = await this.userModel.findByPk(userId, {
      attributes: { exclude: ['password'] },

      include: [
        { model: Admin },
        { model: TeamMember },
        { model: VRolunteeringRequest },
      ],
    });

    if (!user) {
      throw new NotFoundException('there no user found');
    }
    return user;
  }

  async updateUserDetails(teamMemberId, massion) {
    const teamMember = await this.TeamMemberModel.findByPk(teamMemberId);
    if (!teamMember) {
      throw new NotFoundException('this teamMember is not found');
    }
    teamMember.massion = massion ? massion : teamMember.massion;
    teamMember.save();
    return teamMember;
  }

  async showAllVRolunteeringRequest() {
    const allVRolunteeringRequest =
      await this.VRolunteeringRequestModel.findAll();
    if (!allVRolunteeringRequest) {
      throw new NotFoundException('there no any request yet');
    }
    return allVRolunteeringRequest;
  }
  async showVRolunteeringRequestById(VId) {
    const VRolunteeringRequestById =
      await this.VRolunteeringRequestModel.findByPk(VId);
    if (!VRolunteeringRequestById) {
      throw new NotFoundException('there no any request yet');
    }
    return VRolunteeringRequestById;
  }
  async acceptVRolunteeringRequest(VId) {
    const VRolunteeringRequestById =
      await this.VRolunteeringRequestModel.findByPk(VId);
    if (!VRolunteeringRequestById) {
      throw new NotFoundException('there no any request yet');
    }
    const user = await this.userModel.findByPk(VRolunteeringRequestById.userId);
    if (!user) {
      throw new NotFoundException('there no user found');
    }
    user.role = UserRole.TEAMMEMBAR;
    user.save();

    this.TeamMemberModel.create({
      year: VRolunteeringRequestById.year,
      massion: VRolunteeringRequestById.massion,
      universityMajor: VRolunteeringRequestById.universityMajor,
      userId: VRolunteeringRequestById.userId,
    });

    return true;
  }
  async rejectVRolunteeringRequest(VId) {
    const VRolunteeringRequestById =
      await this.VRolunteeringRequestModel.findByPk(VId);
    if (!VRolunteeringRequestById) {
      throw new NotFoundException('there no any request yet');
    }
    VRolunteeringRequestById.destroy();
    return true;
  }
  async updateRole(userId) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('there no user found');
    }
    user.role = UserRole.ADMIN;
    user.save();
    return true;
  }

  async deacreaseRole(userId) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('there no user found');
    }
    user.role = UserRole.TEAMMEMBAR;
    user.save();
    return true;
  }
  async AddLib(user: User) {
    const validationErrors = await validate(new User(user));

    const isExist = await this.userModel.findOne({
      where: { email: user.email },
    });

    if (isExist) {
      throw new BadRequestException('email already used');
    }
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.map((error) =>
        Object.values(error.constraints),
      );
      throw new BadRequestException(errorMessages);
    }

    const saltRounds = 10;
    let password = Math.floor(10000000 + Math.random() * 90000000);
    user.password = await hash(password.toString(), saltRounds);
    const text = `password: ${password} email: ${user.email}`;

    await this.emailService.sendEmail(
      user.email,
      'we are a DNA team we will  happy to be our partner',
      text,
      `<h1>${text}</h1>`,
    );

    await this.userModel.create(user);
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

    const leactures = await this.leactureModel.findAll({
      where,
      attributes: {
        include: [
          [
            Sequelize.fn(
              'COALESCE',
              Sequelize.fn('SUM', Sequelize.col('downloads.amount')),
              0,
            ),
            'totalAmount',
          ],
        ],
      },
      include: [
        {
          model: NumberOfDownloads,
          as: 'downloads',
          attributes: [],
          required: false,
        },
      ],
      group: ['Leacture.subject','Leacture.year'],
    });

    if (!leactures || leactures.length === 0) {
      throw new NotFoundException(
        'There is no lecture according to this filter',
      );
    }

    return leactures;
  }
  async numberOfDownloads(year) {
    if (!year) {
      const now = new Date();
      return await this.leactureModel.statisticalsnumberOfDownloads(
        new Date(`${now}-01-01`).getFullYear(),
      );
    }
    return await this.leactureModel.statisticalsnumberOfDownloads(
      new Date(`${year}-01-01`).getFullYear(),
    );
  }
}
