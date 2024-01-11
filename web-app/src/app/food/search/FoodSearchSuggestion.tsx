interface IFoodSearchSuggestionProps {
  suggestions: string[];
}

export default function FoodSearchSuggestion({
  suggestions,
}: IFoodSearchSuggestionProps) {
  return <>{JSON.stringify(suggestions)}</>;
}
