import React from "react";
import { vi } from "vitest";
import {
  FoodSearchContext,
  IFoodSearchContext,
} from "../../src/app/food/search/FoodSearchContext";

export interface IFoodSearchContextData
  extends Pick<
    IFoodSearchContext,
    | "addedBy"
    | "available"
    | "categories"
    | "maxDistance"
    | "maxDuration"
    | "minQuantity"
    | "order"
    | "price"
    | "query"
  > {}

export default function FakeFoodSearchContext({
  children,
  data,
}: {
  children?: React.ReactNode;
  data: IFoodSearchContextData;
}) {
  return (
    <FoodSearchContext.Provider
      value={{
        // From input
        available: data.available,
        order: data.order,
        query: data.query,
        addedBy: data.addedBy,
        maxDistance: data.maxDistance,
        maxDuration: data.maxDuration,
        minQuantity: data.minQuantity,
        price: data.price,
        categories: data.categories,
        // Fake
        setAddedBy: vi.fn(),
        setAvailable: vi.fn(),
        setCategories: vi.fn(),
        setMaxDistance: vi.fn(),
        setMaxDuration: vi.fn(),
        setMinQuantity: vi.fn(),
        setOrderDistance: vi.fn(),
        setOrderNew: vi.fn(),
        setOrderPrice: vi.fn(),
        setOrderQuantity: vi.fn(),
        setPrice: vi.fn(),
        setQuery: vi.fn(),
      }}
    >
      {children}
    </FoodSearchContext.Provider>
  );
}
