import { ForbiddenException, NotFoundException } from '@nestjs/common';

import {
  ApplicationRepository,
  CreateApplicationData,
} from '~/core/application/application.repository';
import { JobRepository } from '~/core/job/job.repository';
import { UserRepository } from '~/core/user/user.repository';

export class CreateApplicationUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly userRepository: UserRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(data: CreateApplicationData) {
    const user = await this.userRepository.get(data.userId);
    if (!user) {
      throw new NotFoundException(`User with id ${data.userId} not found`);
    }

    const job = await this.jobRepository.get(data.jobId);
    if (!job) {
      throw new NotFoundException(`Job with id ${data.jobId} not found`);
    }

    if (user.isBanned) {
      throw new ForbiddenException('Banned users cannot create applications');
    }

    const existingApplications = await this.applicationRepository.getAll({
      userId: data.userId,
      jobId: data.jobId,
    });

    if (existingApplications.data.length) {
      throw new ForbiddenException('You have already applied to this job');
    }

    return await this.applicationRepository.create(data);
  }
}
