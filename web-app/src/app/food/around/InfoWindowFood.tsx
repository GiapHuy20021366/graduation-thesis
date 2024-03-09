import { IFoodPostExposed } from "../../../data";

interface IInfoWindowFoodProps {
  food: IFoodPostExposed;
}

export default function InfoWindowFood({ food }: IInfoWindowFoodProps) {
  return <span>{JSON.stringify(food)}</span>;
}
