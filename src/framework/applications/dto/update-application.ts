import { PartialType } from '@nestjs/swagger';

import { CreateApplicationDTO } from './create-application';

export class UpdateApplicationDTO extends PartialType(CreateApplicationDTO) {}
