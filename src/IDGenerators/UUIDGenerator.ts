import { v4 as uuidv4 } from 'uuid';
import { IDGenerator } from '../IDGenerator';

export class UUIDGenerator extends IDGenerator<string> {
  id: string = uuidv4();
  generatedIds: string[] = [];

  getId() {
    this.generateId();
    this.generatedIds.push(this.id);
    return this.id;
  }

  generateId() {
    this.id = this.getNextId(this.id);
  }

  getNextId(id: string) {
    const idExists = this.generatedIds.indexOf(id) === -1 ? false : true;
    if (idExists) {
      this.getNextId(uuidv4());
    }
    return id;
  }
}
