import FoodSharingForm from "./FoodSharingForm";
import FoodSharingFormContextProvider from "./FoodSharingFormContext";

export default function FoodSharingPage() {
  return (
    <FoodSharingFormContextProvider>
      <FoodSharingForm />
    </FoodSharingFormContextProvider>
  );
}
