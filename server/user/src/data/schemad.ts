export interface Ided {
  _id: string;
}

export interface Timed {
  createdAt: Date;
  updatedAt: Date;
}

export interface Named {
  exposedName: string;
}

export interface Schemad extends Ided, Timed {}
