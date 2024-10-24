import fs from "node:fs/promises";

type DataContent<T> =
  | string
  | boolean
  | number
  | undefined
  | null
  | T
  | Array<T>;

interface DataType {
  [key: string]: DataContent<DataType>;
}

export class Database {
  #data: DataType = {};
  readonly path: string;

  constructor(path: string = "./data.json") {
    this.path = path;

    (async () => {
      await this.#load();
    })();
  }

  async #load() {
    try {
      const databaseBuffer = await fs.readFile(this.path, {
        encoding: "utf8",
      });

      this.#data = JSON.parse(databaseBuffer.toString());
    } catch (e) {
      this.#save();
    }
  }

  async #save() {
    await fs.writeFile(this.path, JSON.stringify(this.#data), {
      encoding: "utf8",
    });
  }

  async insert(title: string, data: keyof DataType) {
    if (this.#data[title] && this.#data[title] === data) return;

    this.#data[title] = data;

    await this.#save();
  }

  async clear() {
    this.#data = {};
    await this.#save();
  }

  get(title: string): DataContent<DataType> {
    return this.#data[title] ?? null;
  }
}
