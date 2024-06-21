import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

export class ExtendedEntityRepository<
  T extends object,
> extends EntityRepository<T> {
  persist(entity: T | T[]): EntityManager {
    return this.em.persist(entity);
  }

  async persistAndFlush(entity: T | T[]): Promise<void> {
    await this.em.persistAndFlush(entity);
  }

  remove(entity: T): EntityManager {
    return this.em.remove(entity);
  }

  async removeAndFlush(entity: T): Promise<void> {
    await this.em.removeAndFlush(entity);
  }

  async flush(): Promise<void> {
    return this.em.flush();
  }
}
