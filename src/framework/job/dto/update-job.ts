import { PartialType } from '@nestjs/mapped-types';

import { CreateJobDto } from './create-job';

export class UpdateJobDTO extends PartialType(CreateJobDto) {}
