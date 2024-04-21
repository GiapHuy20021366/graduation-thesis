import { Dated } from "./typed";
import { SALT_ROUNDS } from "./env";
import * as bcrypt from "bcrypt";
import { readJSON } from "./json";
import { ObjectId } from "mongodb";

const categories = readJSON<Record<string, string>>(
  "../pre-data/categories.json"
);

const images = readJSON<string[]>("../pre-data/images.json");

export const randInt = (from: number, to: number): number => {
  const random = Math.random();
  return Math.floor(random * (to - from + 1)) + from;
};

export const genTime = (delta?: number): Dated => {
  delta ??= randInt(-30 * 24 * 60 * 60 * 1000, 0);
  return {
    $date: new Date(Date.now() + delta).toISOString(),
  };
};

export const genCategories = (num?: number): string[] => {
  num ??= randInt(2, 4);
  const result: string[] = [];
  let ith = 0;
  const entries = Object.entries(categories);
  const length = entries.length;
  while (ith < num - 1 && ith < length - 1) {
    const randIdx = randInt(0, length - 1);
    const category = entries[randIdx][1];
    if (!result.includes(category)) {
      result.push(category);
      ++ith;
    }
  }
  return result;
};

export const hash = (text: string): string => {
  return bcrypt.hashSync(text, SALT_ROUNDS);
};

export const genImages = (num?: number): string[] => {
  num ??= randInt(2, 4);
  const result: string[] = [];
  let ith = 0;
  const length = images.length;
  while (ith < num - 1 && ith < length - 1) {
    const randIdx = randInt(0, length - 1);
    const img = images[randIdx];
    if (!result.includes(img)) {
      result.push(img);
      ++ith;
    }
  }
  return result;
};

export const genPrice = (xs?: number): number => {
  xs ??= 0.1;
  const rand = Math.random();
  if (rand <= xs) {
    return 0;
  }
  return randInt(0, 50) * 1000;
};

export const uuid = (): string => {
  return new ObjectId().toHexString();
};
