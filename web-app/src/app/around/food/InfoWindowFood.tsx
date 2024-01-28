import { IFoodSearchInfo } from "../../../data";

interface IInfoWindowFoodProps {
  food: IFoodSearchInfo;
}

export default function InfoWindowFood({ food }: IInfoWindowFoodProps) {
  return <span>{JSON.stringify(food)}</span>;
}
