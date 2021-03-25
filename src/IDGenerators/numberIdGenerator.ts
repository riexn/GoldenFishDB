import { IDGenerator } from '../IDGenerator';

export class NumberIdGenerator extends IDGenerator<number> {
  id: number = 0;
  generatedIds: number[] = [-1];

  getId() {
    this.generateId();
    this.generatedIds.push(this.id);
    return this.id;
  }

  generateId() {
    this.id = this.getNextId();
  }

  getNextId(): number {
    const highestNumber = Math.max(...this.generatedIds);
    return highestNumber + 1;
  }
}
