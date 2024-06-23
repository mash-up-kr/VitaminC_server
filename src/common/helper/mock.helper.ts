import { EntityRepository as CoreEntityRepository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ExtendedEntityRepository } from './extended-repository.helper';

const putMockedFunction = (propsNames: string[]) => {
  return propsNames
    .filter((key: string) => key !== 'constructor')
    .reduce((fncs, key: string) => {
      fncs[key] = jest.fn();
      return fncs;
    }, {});
};

export type MockRepository<T extends object> = Partial<
  Record<keyof ExtendedEntityRepository<T>, jest.Mock>
>;

export class MockRepositoryFactory {
  static getMockRepository<T extends object>(
    repository: new (...args: unknown[]) => T,
  ): () => MockRepository<T> {
    return () =>
      putMockedFunction([
        ...Object.getOwnPropertyNames(EntityRepository.prototype),
        ...Object.getOwnPropertyNames(CoreEntityRepository.prototype),
        ...Object.getOwnPropertyNames(ExtendedEntityRepository.prototype),
        ...Object.getOwnPropertyNames(repository.prototype),
      ]);
  }
}

export type MockService<T> = Partial<Record<keyof T, jest.Mock>>;

export class MockServiceFactory {
  static getMockService<T>(
    service: new (...args: unknown[]) => T,
  ): () => MockService<T> {
    return () =>
      putMockedFunction(Object.getOwnPropertyNames(service.prototype));
  }
}
