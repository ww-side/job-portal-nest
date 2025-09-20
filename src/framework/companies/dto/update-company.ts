import { PartialType } from '@nestjs/mapped-types';

import { CreateCompanyDTO } from './create-company';

export class UpdateCompanyDTO extends PartialType(CreateCompanyDTO) {}
