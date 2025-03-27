import type { ObjectId } from "mongodb";

export default class Unit {
  constructor(
    public id: ObjectId,
    public name: string,
  ) { }
}
