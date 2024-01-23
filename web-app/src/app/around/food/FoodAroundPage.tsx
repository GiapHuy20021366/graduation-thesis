import FoodSearchContextProvider from "../../food/search/FoodSearchContext";
import FoodAroundBody from "./FoodAroundBody";

export default function FoodAroundPage() {
  return (
    <FoodSearchContextProvider>
      <FoodAroundBody />
    </FoodSearchContextProvider>
  );
}
