import { IIncludeAndExclude } from "./include-and-exclude";
import { OrderState } from "./order-state";
import { IPagination } from "./pagination";

export interface IMinMax {
  min: number;
  max: number;
}

export const addIncExcQuery = (
  options: Record<string, any>,
  field: string,
  value?: IIncludeAndExclude | null
): void => {
  if (value != null) {
    const include = value.include;
    const valueOption: any = {};

    if (typeof include === "string") {
      valueOption.$eq = include;
    } else if (Array.isArray(include)) {
      valueOption.$in = include;
    }

    const exclude = value.exclude;
    if (typeof exclude === "string") {
      valueOption.$ne = exclude;
    } else if (Array.isArray(exclude)) {
      valueOption.$nin = exclude;
    }

    if (Object.keys(valueOption).length > 0) {
      options[field] = valueOption;
    }
  }
};

export const addMinMaxQuery = (
  options: Record<string, any>,
  field: string,
  value?: Partial<IMinMax> | null
): void => {
  if (value != null) {
    const valueOption: any = {};
    if (value.min != null) {
      valueOption.$gte = value.min;
    }
    if (value.max != null) {
      valueOption.$lte = value.max;
    }
    if (Object.keys(valueOption).length > 0) {
      options[field] = valueOption;
    }
  }
};

export const addMinQuery = (
  options: Record<string, any>,
  field: string,
  value?: number | null
): void => {
  addMinMaxQuery(options, field, {
    min: value ?? undefined,
  });
};

export const addMaxQuery = (
  options: Record<string, any>,
  field: string,
  value?: number | null
): void => {
  addMinMaxQuery(options, field, {
    max: value ?? undefined,
  });
};

export const addArrayQuery = (
  options: Record<string, any>,
  field: string,
  value?: unknown | unknown[] | null
): void => {
  if (value != null) {
    if (Array.isArray(value) && value.length > 0) {
      options[field] = {
        $in: value,
      };
    } else {
      options[field] = {
        $in: [value],
      };
    }
  }
};

export const addValueQuery = (
  options: Record<string, any>,
  field: string,
  value?: unknown | null
): void => {
  if (value != null) {
    options[field] = value;
  }
};

export class QueryBuilder {
  protected _options: Record<string, any>;
  protected _sort: Record<string, any>;
  protected _meta: Record<string, any>;
  protected _skip: number;
  protected _limit: number;

  constructor(
    options?: Record<string, any>,
    sort?: Record<string, any>,
    meta?: Record<string, any>
  ) {
    this._options = options ?? {};
    this._sort = sort ?? {};
    this._meta = meta ?? {};
    this._skip = 0;
    this._limit = 24;
  }

  get options(): Record<string, any> {
    return this._options;
  }

  value(field: string, value?: unknown | null): this {
    addValueQuery(this.options, field, value);
    return this;
  }

  min(field: string, value?: number | null): this {
    addMinQuery(this.options, field, value);
    return this;
  }

  max(field: string, value?: number | null): this {
    addMaxQuery(this.options, field, value);
    return this;
  }

  minMax = (field: string, value?: Partial<IMinMax> | null): this => {
    addMinMaxQuery(this.options, field, value);
    return this;
  };

  array = (field: string, value?: unknown | unknown[] | null): this => {
    addArrayQuery(this.options, field, value);
    return this;
  };

  incAndExc(field: string, value?: IIncludeAndExclude | null): this {
    addIncExcQuery(this.options, field, value);
    return this;
  }

  get sort(): Record<string, any> {
    return this._sort;
  }

  order(field: string, order?: unknown): this {
    if (order != null && order !== OrderState.NONE) {
      this.sort[field] = order;
    }
    return this;
  }

  merge(data?: Record<string, any>): this {
    this._options = {
      ...this._options,
      ...data,
    };
    return this;
  }

  get meta(): Record<string, any> {
    return this._meta;
  }

  me(field: string, value?: unknown | null): this {
    if (value != null) {
      this.meta[field] = value;
    }
    return this;
  }

  pagination(value?: IPagination): this {
    this._skip = value?.skip ?? 0;
    this._limit = value?.limit ?? 24;
    return this;
  }

  get skip(): number {
    return this._skip;
  }

  get limit(): number {
    return this._limit;
  }
}
