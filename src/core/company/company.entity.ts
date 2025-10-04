export interface CompanyEntityProps {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  ownerId: string;
  recruiterIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class CompanyEntity {
  public readonly id: string;
  public name: string;
  public description?: string;
  public website?: string;
  public logoUrl?: string;
  public ownerId: string;
  public recruiterIds: string[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CompanyEntityProps) {
    Object.assign(this, props);
    this.recruiterIds = props.recruiterIds ?? [];
  }
}
