export interface JobEntityProps {
  id: string;
  title: string;
  description: string;
  companyId: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  statusId: string;
  typeId: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class JobEntity {
  public readonly id: string;
  public title: string;
  public description: string;
  public companyId: string;
  public location: string;
  public salaryMin?: number;
  public salaryMax?: number;
  public statusId: string;
  public typeId: string;
  public skills: string[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: JobEntityProps) {
    Object.assign(this, props);
    this.skills = props.skills ?? [];
  }

  updateInfo(
    data: Partial<
      Omit<JobEntityProps, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>
    >,
  ) {
    Object.assign(this, data);
  }

  addSkill(skill: string) {
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
    }
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter((s) => s !== skill);
  }
}
