import { ApplicationStatusEntity } from '~/core/application/application.entity';
import { ApplicationStatusRepository } from '~/core/application/application.repository';

import { mockApplicationStatusRepository } from '~/test/mocks/repositories';

import { GetAllApplicationStatusesUseCase } from './get-all-application-statuses.case';

describe('GetAllApplicationStatusesUseCase', () => {
  let useCase: GetAllApplicationStatusesUseCase;
  let applicationStatusRepository: jest.Mocked<ApplicationStatusRepository>;

  beforeEach(() => {
    applicationStatusRepository = mockApplicationStatusRepository;
    useCase = new GetAllApplicationStatusesUseCase(applicationStatusRepository);
  });

  it('returns all application statuses', async () => {
    const statuses = [
      new ApplicationStatusEntity({ id: '1', name: 'Pending' }),
      new ApplicationStatusEntity({ id: '2', name: 'Accepted' }),
      new ApplicationStatusEntity({ id: '3', name: 'Rejected' }),
    ];

    applicationStatusRepository.getAll.mockResolvedValue(statuses);

    const result = await useCase.execute();

    expect(applicationStatusRepository.getAll.mock.calls).toHaveLength(1);
    expect(result).toEqual(statuses);
  });

  it('returns empty array if no statuses exist', async () => {
    applicationStatusRepository.getAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(applicationStatusRepository.getAll.mock.calls).toHaveLength(1);
    expect(result).toEqual([]);
  });
});
