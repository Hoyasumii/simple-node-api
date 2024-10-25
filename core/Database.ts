import fs from "node:fs/promises";
import { Collection } from "./Collection";

export class Database {
  #data: Record<string, Array<unknown>> = {};
  readonly #path: string;

  constructor(path: string = "./data.json") {
    this.#path = path;
  }

  async load() {
    try {
      const databaseBuffer = await fs.readFile(this.#path, {
        encoding: "utf8",
      });

      this.#data = JSON.parse(databaseBuffer.toString());
    } catch (e) {
      this.#save();
    }
  }

  async #save() {
    await fs.writeFile(this.#path, JSON.stringify(this.#data), {
      encoding: "utf8",
    });
  }

  collection = {
    create: async (title: string, $ref?: Array<string>): Promise<boolean> => {
      if (this.#data[title]) return false;

      this.#data[title] = [];
      await this.#save();

      return true;
    },

    pick: <Schema extends Object = Object>(
      title: string
    ): Collection<Schema> | undefined => {
      if (!this.#data[title]) return undefined;

      return new Collection<Schema>(this.#data[title] as never, this.#save);
    },

    remove: (title: string): boolean => {
      if (!this.#data[title]) return false;

      return delete this.#data[title];
    },
  };

  schema = {
    // register(title: string, schema:)
  }

  async clear() {
    this.#data = {};
    await this.#save();
  }
}

const db = new Database();

(async () => {
  await db.load();
  await db.collection.create("users");
  const users = db.collection.pick<{ name: string }>("users");
})();
