import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import React from "react";
import FoodSharingForm from "../src/app/food/sharing/FoodSharingForm";
import { ClipboardEventMock, DragEventMock } from "./utils/richTextTestUtils";
import FakeNeccesaryContexts from "./contexts/FakeNeccesaryContexts";
import FakeFoodSharingFormContext from "./contexts/FakeFoodSharingFormContext";
import { FoodCategory, toQuantityType } from "../src/data";
import { act } from "react-dom/test-utils";

vi.mock("../src/api");

(global as any).ClipboardEvent = ClipboardEventMock;
(global as any).DragEvent = DragEventMock;

const mocks = vi.hoisted(() => {
  return {
    useNavigate: vi.fn(),
    uploadFood: vi.fn(),
    updateFood: vi.fn(),
    getUsersAndPlacesFollowed: vi.fn(),
  };
});

// Mock useNavigate
vi.mock("react-router", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router")>();
  return {
    ...mod,
    useNavigate: mocks.useNavigate,
  };
});

// Mock foodFetcher
vi.mock("../src/api", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../src/api")>();
  const { foodFetcher, userFetcher } = mod;
  return {
    ...mod,
    foodFetcher: {
      ...foodFetcher,
      uploadFood: mocks.uploadFood,
      updateFood: mocks.updateFood,
    },
    userFetcher: {
      ...userFetcher,
      getUsersAndPlacesFollowed: mocks.getUsersAndPlacesFollowed,
    },
  };
});

describe("FoodSharingForm Test", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  // - Test page 1 have enoungh components
  it("Page 1 basic information have enough components", async () => {
    const data = {
      categories: [FoodCategory.ANIMAL_PRODUCT],
      description: "--Description",
      duration: new Date().toISOString(),
      images: [{ _id: "0", name: "0", url: "https://i.pravatar.cc/150?img=3" }],
      isEditable: false,
      location: {
        name: "--Location",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      price: 0,
      quantity: 4,
      title: "--Title",
      place: undefined,
    };
    render(
      <FakeNeccesaryContexts>
        <FakeFoodSharingFormContext data={data}>
          <FoodSharingForm />
        </FakeFoodSharingFormContext>
      </FakeNeccesaryContexts>
    );

    const backButton = screen.queryByText("back");
    expect(backButton, "Back button is in document").toBeInTheDocument();
    expect(backButton, "Back button in disabled").toHaveAttribute("disabled");

    const nextButton = screen.queryByText("next");
    expect(nextButton, "Back button is in document").toBeInTheDocument();
    expect(nextButton, "Back button in not disabled").not.toHaveAttribute(
      "disabled"
    );

    // Page 1
    expect(screen.queryByText("images"), "Images").toBeInTheDocument();
    const imageListItems = screen.getAllByRole("listitem");
    expect(imageListItems).toHaveLength(
      data.images.length < 8 ? data.images.length + 1 : 8
    ); /** 1 image + 1 picker */

    expect(screen.queryByText("l-title"), "Food title").toBeInTheDocument();
    expect(
      screen.queryByDisplayValue(data.title),
      "Food title content"
    ).toBeInTheDocument();

    expect(
      screen.queryByText("description"),
      "Description Title"
    ).toBeInTheDocument();
    expect(
      screen.queryByText(data.description),
      "Description HTML"
    ).toBeInTheDocument();

    expect(
      screen.queryByText("l-duration"),
      "Duration Title"
    ).toBeInTheDocument();
    // expect(
    //   screen.queryByDisplayValue(data.duration),
    //   "Duration Value"
    // ).toBeInTheDocument();
    expect(
      screen.queryByText("UNTIL_MIDNIGHT"),
      "Duration Type"
    ).toBeInTheDocument();

    expect(
      screen.queryByText("l-quantity:"),
      "Quantity Title"
    ).toBeInTheDocument();
    expect(
      screen.queryByText(toQuantityType(data.quantity)),
      "Quantity Content"
    ).toBeInTheDocument();

    // Page 2
    expect(
      screen.queryByText("post-on"),
      "Place Title"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("want-share-on"),
      "Place Description"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("your-personal-page"),
      "Place Value"
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("category"),
      "Category Title"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("category-body"),
      "Category Description"
    ).not.toBeInTheDocument();
    data.categories.forEach((category) => {
      expect(
        screen.queryByText(category),
        "Category Value"
      ).not.toBeInTheDocument();
    });

    expect(
      screen.queryByText("price-description"),
      "Price description"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("l-price"),
      "Price Title"
    ).not.toBeInTheDocument();
    expect(screen.queryByText("FREE"), "Price Type").not.toBeInTheDocument();

    expect(
      screen.queryByText("share-now"),
      "Share now"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("update-now"),
      "Update now"
    ).not.toBeInTheDocument();
  });

  // Test page 2 can not render if don't have title (empty) => check toast message and ui components
  it("Page 2 can not render if don't have title (empty)", async () => {
    const data = {
      categories: [FoodCategory.ANIMAL_PRODUCT],
      description: "--Description",
      duration: new Date().toISOString(),
      images: [{ _id: "0", name: "0", url: "https://i.pravatar.cc/150?img=3" }],
      isEditable: false,
      location: {
        name: "--Location",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      price: 0,
      quantity: 4,
      title: "",
      place: undefined,
    };
    render(
      <FakeNeccesaryContexts>
        <FakeFoodSharingFormContext data={data}>
          <FoodSharingForm />
        </FakeFoodSharingFormContext>
      </FakeNeccesaryContexts>
    );
    expect(screen.queryByText("next"), "Next");
    act(() => {
      const button = screen.queryByText("next");
      fireEvent.click(button!);
    });

    // Check toast message
    await waitFor(
      () => {
        expect(
          screen.queryByText("empty-title-error"),
          "Empty title error"
        ).toBeInTheDocument();
      },
      { timeout: 200 }
    );

    const backButton = screen.queryByText("back");
    expect(backButton, "Back button is in document").toBeInTheDocument();
    expect(backButton, "Back button in disabled").toHaveAttribute("disabled");

    const nextButton = screen.queryByText("next");
    expect(nextButton, "Back button is in document").toBeInTheDocument();
    expect(nextButton, "Back button in not disabled").not.toHaveAttribute(
      "disabled"
    );

    // Page 1
    expect(screen.queryByText("images"), "Images").toBeInTheDocument();
    const imageListItems = screen.getAllByRole("listitem");
    expect(imageListItems).toHaveLength(
      data.images.length < 8 ? data.images.length + 1 : 8
    ); /** 1 image + 1 picker */

    expect(screen.queryByText("l-title"), "Food title").toBeInTheDocument();

    expect(
      screen.queryByText("description"),
      "Description Title"
    ).toBeInTheDocument();
    expect(
      screen.queryByText(data.description),
      "Description HTML"
    ).toBeInTheDocument();

    expect(
      screen.queryByText("l-duration"),
      "Duration Title"
    ).toBeInTheDocument();
    expect(
      screen.queryByText("UNTIL_MIDNIGHT"),
      "Duration Type"
    ).toBeInTheDocument();

    expect(
      screen.queryByText("l-quantity:"),
      "Quantity Title"
    ).toBeInTheDocument();
    expect(
      screen.queryByText(toQuantityType(data.quantity)),
      "Quantity Content"
    ).toBeInTheDocument();

    // Page 2
    expect(
      screen.queryByText("post-on"),
      "Place Title"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("want-share-on"),
      "Place Description"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("your-personal-page"),
      "Place Value"
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("category"),
      "Category Title"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("category-body"),
      "Category Description"
    ).not.toBeInTheDocument();
    data.categories.forEach((category) => {
      expect(
        screen.queryByText(category),
        "Category Value"
      ).not.toBeInTheDocument();
    });

    expect(
      screen.queryByText("price-description"),
      "Price description"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("l-price"),
      "Price Title"
    ).not.toBeInTheDocument();
    expect(screen.queryByText("FREE"), "Price Type").not.toBeInTheDocument();

    expect(
      screen.queryByText("share-now"),
      "Share now"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("update-now"),
      "Update now"
    ).not.toBeInTheDocument();
  });

  // Test page 2 can not render if don't have images (empty) => check toast message and ui components
  it("Page 2 can not render if don't have images (empty)", async () => {
    const data = {
      categories: [FoodCategory.ANIMAL_PRODUCT],
      description: "--Description",
      duration: new Date().toISOString(),
      images: [],
      isEditable: false,
      location: {
        name: "--Location",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      price: 0,
      quantity: 4,
      title: "--Title",
      place: undefined,
    };
    render(
      <FakeNeccesaryContexts>
        <FakeFoodSharingFormContext data={data}>
          <FoodSharingForm />
        </FakeFoodSharingFormContext>
      </FakeNeccesaryContexts>
    );
    expect(screen.queryByText("next"), "Next");
    act(() => {
      const button = screen.queryByText("next");
      fireEvent.click(button!);
    });

    // Check toast message
    await waitFor(
      () => {
        expect(
          screen.queryByText("empty-images-error"),
          "Empty title error"
        ).toBeInTheDocument();
      },
      { timeout: 200 }
    );

    const backButton = screen.queryByText("back");
    expect(backButton, "Back button is in document").toBeInTheDocument();
    expect(backButton, "Back button in disabled").toHaveAttribute("disabled");

    const nextButton = screen.queryByText("next");
    expect(nextButton, "Back button is in document").toBeInTheDocument();
    expect(nextButton, "Back button in not disabled").not.toHaveAttribute(
      "disabled"
    );

    // Page 1
    expect(screen.queryByText("images"), "Images").toBeInTheDocument();
    const imageListItems = screen.getAllByRole("listitem");
    expect(imageListItems).toHaveLength(
      data.images.length < 8 ? data.images.length + 1 : 8
    ); /** 1 image + 1 picker */

    expect(screen.queryByText("l-title"), "Food title").toBeInTheDocument();
    expect(
      screen.queryByDisplayValue(data.title),
      "Food title content"
    ).toBeInTheDocument();

    expect(
      screen.queryByText("description"),
      "Description Title"
    ).toBeInTheDocument();
    expect(
      screen.queryByText(data.description),
      "Description HTML"
    ).toBeInTheDocument();

    expect(
      screen.queryByText("l-duration"),
      "Duration Title"
    ).toBeInTheDocument();
    expect(
      screen.queryByText("UNTIL_MIDNIGHT"),
      "Duration Type"
    ).toBeInTheDocument();

    expect(
      screen.queryByText("l-quantity:"),
      "Quantity Title"
    ).toBeInTheDocument();
    expect(
      screen.queryByText(toQuantityType(data.quantity)),
      "Quantity Content"
    ).toBeInTheDocument();

    // Page 2
    expect(
      screen.queryByText("post-on"),
      "Place Title"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("want-share-on"),
      "Place Description"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("your-personal-page"),
      "Place Value"
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("category"),
      "Category Title"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("category-body"),
      "Category Description"
    ).not.toBeInTheDocument();
    data.categories.forEach((category) => {
      expect(
        screen.queryByText(category),
        "Category Value"
      ).not.toBeInTheDocument();
    });

    expect(
      screen.queryByText("price-description"),
      "Price description"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("l-price"),
      "Price Title"
    ).not.toBeInTheDocument();
    expect(screen.queryByText("FREE"), "Price Type").not.toBeInTheDocument();

    expect(
      screen.queryByText("share-now"),
      "Share now"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("update-now"),
      "Update now"
    ).not.toBeInTheDocument();
  });

  // Test page 2 have enough components
  it("Page 2 optional information have enough components", async () => {
    mocks.getUsersAndPlacesFollowed.mockReturnValue(
      Promise.resolve({ data: [] })
    );
    const data = {
      categories: [FoodCategory.ANIMAL_PRODUCT],
      description: "--Description",
      duration: new Date().toISOString(),
      images: [{ _id: "0", name: "0", url: "https://i.pravatar.cc/150?img=3" }],
      isEditable: false,
      location: {
        name: "--Location",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      price: 0,
      quantity: 4,
      title: "--Title",
      place: undefined,
    };
    render(
      <FakeNeccesaryContexts>
        <FakeFoodSharingFormContext data={data}>
          <FoodSharingForm />
        </FakeFoodSharingFormContext>
      </FakeNeccesaryContexts>
    );
    expect(screen.queryByText("next"), "Next");
    act(() => {
      const button = screen.queryByText("next");
      fireEvent.click(button!);
    });

    const backButton = screen.queryByText("back");
    expect(backButton, "Back button is in document").toBeInTheDocument();
    expect(backButton, "Back button in disabled").not.toHaveAttribute(
      "disabled"
    );

    const nextButton = screen.queryByText("next");
    expect(nextButton, "Back button is in document").toBeInTheDocument();
    expect(nextButton, "Back button in not disabled").toHaveAttribute(
      "disabled"
    );

    // Page 1
    expect(screen.queryByText("images"), "Images").not.toBeInTheDocument();

    expect(screen.queryByText("l-title"), "Food title").not.toBeInTheDocument();
    expect(
      screen.queryByDisplayValue(data.title),
      "Food title content"
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("description"),
      "Description Title"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(data.description),
      "Description HTML"
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("l-duration"),
      "Duration Title"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("UNTIL_MIDNIGHT"),
      "Duration Type"
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("l-quantity:"),
      "Quantity Title"
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(toQuantityType(data.quantity)),
      "Quantity Content"
    ).not.toBeInTheDocument();

    // Page 2
    expect(screen.queryByText("post-on"), "Place Title").toBeInTheDocument();
    expect(
      screen.queryByText("want-share-on"),
      "Place Description"
    ).toBeInTheDocument();
    expect(
      screen.queryByText("your-personal-page"),
      "Place Value"
    ).toBeInTheDocument();

    expect(
      screen.queryByText("category"),
      "Category Title"
    ).toBeInTheDocument();
    expect(
      screen.queryByText("category-body"),
      "Category Description"
    ).toBeInTheDocument();
    data.categories.forEach((category) => {
      expect(
        screen.queryByText(category),
        "Category Value"
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText("price-description"),
      "Price description"
    ).toBeInTheDocument();
    expect(screen.queryByText("price"), "Price Title").toBeInTheDocument();
    expect(screen.queryByText("FREE"), "Price Type").toBeInTheDocument();

    expect(screen.queryByText("share-now"), "Share now").toBeInTheDocument();
    expect(
      screen.queryByText("update-now"),
      "Update now"
    ).not.toBeInTheDocument();
  });

  it("Test sharing food fail", async () => {
    const data = {
      categories: [FoodCategory.ANIMAL_PRODUCT],
      description: "--Description",
      duration: new Date().toISOString(),
      images: [{ _id: "0", name: "0", url: "https://i.pravatar.cc/150?img=3" }],
      isEditable: false,
      location: {
        name: "--Location",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      price: 0,
      quantity: 4,
      title: "--Title",
      place: undefined,
    };
    render(
      <FakeNeccesaryContexts>
        <FakeFoodSharingFormContext data={data}>
          <FoodSharingForm />
        </FakeFoodSharingFormContext>
      </FakeNeccesaryContexts>
    );
    expect(screen.queryByText("next"), "Next");
    act(() => {
      const button = screen.queryByText("next");
      fireEvent.click(button!);
    });
    mocks.uploadFood.mockRejectedValue({});
    const submitButton = screen.getByText("share-now");
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(
      () => {
        expect(mocks.uploadFood).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("can-not-sharing-now")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("Test sharing food success", async () => {
    const data = {
      categories: [FoodCategory.ANIMAL_PRODUCT],
      description: "--Description",
      duration: new Date().toISOString(),
      images: [{ _id: "0", name: "0", url: "https://i.pravatar.cc/150?img=3" }],
      isEditable: false,
      location: {
        name: "--Location",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      price: 0,
      quantity: 4,
      title: "--Title",
      place: undefined,
    };
    render(
      <FakeNeccesaryContexts>
        <FakeFoodSharingFormContext data={data}>
          <FoodSharingForm />
        </FakeFoodSharingFormContext>
      </FakeNeccesaryContexts>
    );
    expect(screen.queryByText("next"), "Next");
    act(() => {
      const button = screen.queryByText("next");
      fireEvent.click(button!);
    });
    mocks.uploadFood.mockResolvedValue({ data: { _id: "Success Test ID" } });
    act(() => {
      const submitButton = screen.getByText("share-now");
      fireEvent.click(submitButton);
    });
    const spyNavigate = vi.fn();
    mocks.useNavigate.mockReturnValue(spyNavigate);
    await waitFor(
      () => {
        expect(mocks.uploadFood).toHaveBeenCalledTimes(1);
        // expect(spyNavigate).toBeCalledTimes(1);
        // expect(spyNavigate).toBeCalledWith("Success Test ID");
      },
      { timeout: 1000 }
    );
  });

  it("Test update food success", async () => {
    const data = {
      categories: [FoodCategory.ANIMAL_PRODUCT],
      description: "--Description",
      duration: new Date().toISOString(),
      images: [{ _id: "0", name: "0", url: "https://i.pravatar.cc/150?img=3" }],
      isEditable: true,
      location: {
        name: "--Location",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      price: 0,
      quantity: 4,
      title: "--Title",
      place: undefined,
    };
    render(
      <FakeNeccesaryContexts>
        <FakeFoodSharingFormContext
          data={data}
          preData={{
            ...data,
            images: [],
            _id: "Test",
            isEdited: false,
            likeCount: 1,
            resolved: false,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: "Test User",
          }}
        >
          <FoodSharingForm />
        </FakeFoodSharingFormContext>
      </FakeNeccesaryContexts>
    );
    expect(screen.queryByText("next"), "Next");
    act(() => {
      const button = screen.queryByText("next");
      fireEvent.click(button!);
    });
    mocks.updateFood.mockResolvedValue({ data: { _id: "Success Test ID" } });
    const spyNavigate = vi.fn();
    mocks.useNavigate.mockReturnValue(spyNavigate);
    act(() => {
      const submitButton = screen.getByText("update-now");
      fireEvent.click(submitButton);
    });
    await waitFor(
      () => {
        expect(mocks.updateFood).toHaveBeenCalledTimes(1);
        // expect(spyNavigate).toBeCalledTimes(1);
        // expect(spyNavigate).toBeCalledWith("Success Test ID");
      },
      { timeout: 1000 }
    );
  });

  it("Test update food fail", async () => {
    const data = {
      categories: [FoodCategory.ANIMAL_PRODUCT],
      description: "--Description",
      duration: new Date().toISOString(),
      images: [{ _id: "0", name: "0", url: "https://i.pravatar.cc/150?img=3" }],
      isEditable: true,
      location: {
        name: "--Location",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      price: 0,
      quantity: 4,
      title: "--Title",
      place: undefined,
    };
    render(
      <FakeNeccesaryContexts>
        <FakeFoodSharingFormContext
          data={data}
          preData={{
            ...data,
            images: [],
            _id: "Test",
            isEdited: false,
            likeCount: 1,
            resolved: false,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: "Test User",
          }}
        >
          <FoodSharingForm />
        </FakeFoodSharingFormContext>
      </FakeNeccesaryContexts>
    );
    expect(screen.queryByText("next"), "Next");
    act(() => {
      const button = screen.queryByText("next");
      fireEvent.click(button!);
    });
    mocks.updateFood.mockRejectedValue({});
    const spyNavigate = vi.fn();
    mocks.useNavigate.mockReturnValue(spyNavigate);
    act(() => {
      const submitButton = screen.getByText("update-now");
      fireEvent.click(submitButton);
    });
    await waitFor(
      () => {
        expect(mocks.updateFood).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("can-not-sharing-now")).toBeInTheDocument();
        // expect(spyNavigate).toBeCalledTimes(1);
        // expect(spyNavigate).toBeCalledWith("Success Test ID");
      },
      { timeout: 1000 }
    );
  });
});
