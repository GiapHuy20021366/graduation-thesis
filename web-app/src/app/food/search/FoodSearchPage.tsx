import FoodSearchBody from "./FoodSearchBody";
import FoodSearchContextProvider from "./FoodSearchContext";
import { FoodCategory } from "../../../data";
import { useSearchParams } from "react-router-dom";

const parseCategories = (str?: string | null): string[] | undefined => {
  if (str == null) return;
  try {
    const arr = JSON.parse(str);
    if (
      Array.isArray(arr) &&
      arr.every((t) => Object.values(FoodCategory).includes(t))
    ) {
      return arr;
    }
  } catch (error) {
    // DO NOTHING
  }
};

export default function FoodSearchPage() {
  const [searchParams] = useSearchParams();
  const categories = searchParams.get("categories");
  return (
    <FoodSearchContextProvider categories={parseCategories(categories)}>
      <FoodSearchBody />
    </FoodSearchContextProvider>
  );
}
