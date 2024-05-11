import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import FoodSearchBody from "../src/app/food/search/FoodSearchBody";
import { ClipboardEventMock, DragEventMock } from "./utils/richTextTestUtils";
import FakeNeccesaryContexts from "./contexts/FakeNeccesaryContexts";
import FakeFoodSearchContext, {
  IFoodSearchContextData,
} from "./contexts/FakeFoodSearchContext";
import { FoodCategory, IFoodPostExposed } from "../src/data";
import { act } from "react-dom/test-utils";

vi.mock("../src/api");

(global as any).ClipboardEvent = ClipboardEventMock;
(global as any).DragEvent = DragEventMock;

const mocks = vi.hoisted(() => {
  return {
    searchHistory: vi.fn(),
    searchFood: vi.fn(),
  };
});

// Mock foodFetcher
vi.mock("../src/api", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../src/api")>();
  const { foodFetcher } = mod;
  return {
    ...mod,
    foodFetcher: {
      ...foodFetcher,
      searchHistory: mocks.searchHistory,
      searchFood: mocks.searchFood,
    },
  };
});

const baseData: IFoodPostExposed = {
  _id: "0",
  active: true,
  categories: [],
  createdAt: new Date().toISOString(),
  duration: new Date().toISOString(),
  images: [],
  isEdited: false,
  likeCount: 0,
  location: {
    name: "Test0",
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
  price: 0,
  quantity: 0,
  title: "--Title",
  updatedAt: new Date().toISOString(),
  user: "--User",
  description: "",
  place: "--Place",
  resolved: false,
};

const genData = () => {
  const searchData: IFoodPostExposed[] = [];
  for (let i = 0; i < 23; ++i) {
    searchData.push({
      ...baseData,
      _id: String(Date.now() + Math.floor(Math.random() * 100000)),
    });
  }
  return searchData;
};

describe("FoodSharingForm Test", () => {
  beforeEach(() => {
    mocks.searchHistory.mockResolvedValue({ data: [] });
    mocks.searchFood.mockResolvedValue({ data: [] });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Check basic components: search input, filter button, tabs, result
  it("Check basic components", async () => {
    const searchData = genData();
    mocks.searchFood.mockResolvedValue({ data: searchData });
    const data: IFoodSearchContextData = {
      available: "ALL",
      order: {
        distance: 0,
        price: 0,
        quantity: 0,
        time: 0,
      },
      query: "--Query",
      addedBy: [0],
      categories: [FoodCategory.BEVERAGES, FoodCategory.BEVERAGES],
      maxDistance: 2,
      maxDuration: 2,
      minQuantity: 3,
      price: {
        max: undefined,
        min: undefined,
      },
    };

    const result = render(
      <FakeNeccesaryContexts>
        <FakeFoodSearchContext data={data}>
          <FoodSearchBody />
        </FakeFoodSearchContext>
      </FakeNeccesaryContexts>
    );

    // input search
    expect(screen.getByDisplayValue(data.query)).toBeInTheDocument();
    // button search
    expect(
      result.container.querySelector("#f-s-b-btn-filter")
    ).toBeInTheDocument();
    // button filter
    expect(
      result.container.querySelector("#f-s-b-btn-filter")
    ).toBeInTheDocument();
    // Tabs
    expect(result.queryByText("l-relative")).toBeInTheDocument();
    expect(result.queryByText("l-distance")).toBeInTheDocument();
    expect(result.queryByText("l-price")).toBeInTheDocument();
    expect(result.queryByText("l-quantity")).toBeInTheDocument();

    // result
    await waitFor(
      () => {
        expect(mocks.searchFood).toBeCalledTimes(1);
        searchData.forEach((d) => {
          expect(
            result.container.querySelector(`#${d._id}`)
          ).toBeInTheDocument();
        });
      },
      { timeout: 1000 }
    );

    // list end
    expect(
      result.container.querySelector("#f-s-b-list-end")
    ).toBeInTheDocument();
  });

  // Check filter open correctly
  it("Check filter open correct", async () => {
    const searchData = genData();
    mocks.searchFood.mockResolvedValue({ data: searchData });
    const data: IFoodSearchContextData = {
      available: "ALL",
      order: {
        distance: 0,
        price: 0,
        quantity: 0,
        time: 0,
      },
      query: "--Query",
      addedBy: [0],
      categories: [FoodCategory.BEVERAGES, FoodCategory.ANIMAL_PRODUCT],
      maxDistance: 2,
      maxDuration: 2,
      minQuantity: 3,
      price: {
        max: undefined,
        min: undefined,
      },
    };

    const result = render(
      <FakeNeccesaryContexts>
        <FakeFoodSearchContext data={data}>
          <FoodSearchBody />
        </FakeFoodSearchContext>
      </FakeNeccesaryContexts>
    );

    const buttonFilter = result.container.querySelector("#f-s-b-btn-filter");
    act(() => {
      fireEvent.click(buttonFilter!);
    });

    expect(result.queryByText("search-filter")).toBeInTheDocument();

    expect(result.queryByText("item-added-by:")).toBeInTheDocument();
    // expect(
    //   result.container.querySelector("#f-s-f-item-added-by-all")
    // ).toBeInTheDocument();
    expect(result.queryByText("l-volunteer")).toBeInTheDocument();
    expect(result.queryByText("l-place")).toBeInTheDocument();

    expect(result.queryByText("item-available:")).toBeInTheDocument();
    // expect(
    //   result.container.querySelector("#f-s-f-item-available-all")
    // ).toBeInTheDocument();
    expect(result.queryByText("l-available-only")).toBeInTheDocument();
    expect(result.queryByText("l-just-gone")).toBeInTheDocument();

    expect(result.queryByText("max-distance:")).toBeInTheDocument();
    // expect(
    //   result.container.querySelector("#f-s-f-max-distance-all")
    // ).toBeInTheDocument();
    expect(result.queryByText("0.5 km")).toBeInTheDocument();
    expect(result.queryByText("1 km")).toBeInTheDocument();
    expect(result.queryByText("2 km")).toBeInTheDocument();
    expect(result.queryByText("5 km")).toBeInTheDocument();
    expect(result.queryByText("10 km")).toBeInTheDocument();
    expect(result.queryByText("25 km")).toBeInTheDocument();
    expect(result.queryByText("50 km")).toBeInTheDocument();

    expect(result.queryByText("max-duration:")).toBeInTheDocument();
    // expect(
    //   result.container.querySelector("#f-s-f-max-duration-all")
    // ).toBeInTheDocument();
    expect(result.queryByText("1-day")).toBeInTheDocument();
    expect(result.queryByText("2-days")).toBeInTheDocument();
    expect(result.queryByText("3-days")).toBeInTheDocument();

    expect(result.queryByText("category:")).toBeInTheDocument();
    // expect(
    //   result.container.querySelector("#f-s-f-category-typography")
    // ).toBeInTheDocument();
    data.categories?.forEach((c) => {
      expect(result.queryByText(c)).toBeInTheDocument();
    });

    expect(result.queryByText("min-quantity:")).toBeInTheDocument();

    expect(result.queryByText("price-range:")).toBeInTheDocument();
    // expect(
    //   result.container.querySelector("#f-s-f-price-range-all")
    // ).toBeInTheDocument();
    expect(result.queryByText("l-free")).toBeInTheDocument();
    // expect(result.queryByText("l-custom")).toBeInTheDocument();

    expect(result.queryByText("reset")).toBeInTheDocument();
    expect(result.queryByText("apply")).toBeInTheDocument();
  });
});
