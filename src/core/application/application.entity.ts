export interface ApplicationEntityProps {
  id: string;
  userId: string;
  jobId: string;
  message: string;
  cvUrl?: string;
  statusId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ApplicationEntity {
  public readonly id: string;
  public userId: string;
  public jobId: string;
  public message: string;
  public cvUrl?: string;
  public statusId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ApplicationEntityProps) {
    Object.assign(this, props);
  }

  updateMessage(message: string) {
    this.message = message;
  }

  updateCvUrl(cvUrl: string) {
    this.cvUrl = cvUrl;
  }

  updateStatus(statusId: string) {
    this.statusId = statusId;
  }
}

export interface ApplicationStatusEntityProps {
  id: string;
  name: string;
}

export class ApplicationStatusEntity {
  public readonly id: string;
  public name: string;

  constructor(props: ApplicationStatusEntityProps) {
    Object.assign(this, props);
  }

  updateName(name: string) {
    this.name = name;
  }
}
