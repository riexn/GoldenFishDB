export class IDGenerator<Type extends string | number> {
  id: Type;
  generatedIds: Type[] = [];
  constructor(id: Type) {
    this.id = id;
  }
  getId(): Type {
    return this.id;
  }
}
