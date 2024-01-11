import FoodSearchBody from "./FoodSearchBody";
import FoodSearchContextProvider from "./FoodSearchContext";

export default function FoodSearchPage() {
  return (
    <FoodSearchContextProvider>
      <FoodSearchBody />
    </FoodSearchContextProvider>
  );
}
