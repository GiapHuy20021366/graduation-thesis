import { consoleLogger } from "../config";

export type WorkerTask = () => Promise<boolean>;
export class TaskExecutable {
  private _nWorkers: number;
  private _nWorkings: number;
  private _orders: WorkerTask[];
  constructor(nWorkers: number = 5) {
    this._nWorkers = nWorkers;
    this._nWorkings = 0;
    this._orders = [];
  }

  add(task: WorkerTask) {
    const isTrigger = this.orders.length === 0;
    this.orders.push(task);
    isTrigger && this.trigger();
  }

  private trigger() {
    while (this._nWorkings < this._nWorkers) {
      const work = this.orders.shift();
      if (work == null) {
        break;
      }
      this._nWorkings++;
      work()
        .then((result) => {
          if (result === false) {
            throw new Error("Worker return status Falsy");
          }
        })
        .catch((err) => {
          consoleLogger.err("An error when execute worker: ", err);
        })
        .finally(() => {
          this._nWorkings--;
        });
    }
  }

  private get orders(): WorkerTask[] {
    return this._orders;
  }
}

export class TaskScheduler {
  constructor(
    name: string,
    task: () => Promise<any>,
    duration: number = 12 * 60 * 60 * 1000,
    init: boolean = true
  ) {
    consoleLogger.info("[SCHEDULER]", name, "inited");
    init && task();
    const timeBound = () => {
      setTimeout(() => {
        task();
        timeBound();
      }, duration);
    };
    timeBound();
  }
}
