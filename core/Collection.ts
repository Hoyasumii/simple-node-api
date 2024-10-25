import { randomUUID } from "node:crypto";

type SchemaWithId<T extends Object> = T & { _id: string };

export class Collection<Schema extends Object> {
  #content: Array<SchemaWithId<Schema>>;
  #hashedContent: Record<string, Schema> = {};
  #saveHandler: () => Promise<void>;
  $ref: Array<string> = [];

  constructor(
    content: Array<SchemaWithId<Schema>>,
    saveHandler: () => Promise<void>
  ) {
    this.#content = content;
    this.#saveHandler = saveHandler;
  }

  optimize() {
    this.#content.forEach((content) => {
      const { _id, ...data } = content;

      this.#hashedContent[content._id] = data as unknown as Schema;
    });
  }

  async register(data: Schema) {
    const _id = randomUUID().toString();

    this.#hashedContent[_id] = data;

    this.#content.push({
      ...data,
      _id,
    });

    await this.#saveHandler();
  }

  find(
    $where: (item: SchemaWithId<Schema>) => boolean
  ): Array<SchemaWithId<Schema>> {}

  findById() {}

  remove() {}

  removeById() {}

  save() {}

  array = {};

  // update() {}

  // updateById() {}
}
