import { toTimeInfo } from "../../../data";

interface IFoodItemDurationProps {
  duration?: number | string | Date;
}

const toPad = (num: number): string => {
  return num < 10 ? "0" + num : String(num);
};

export default function FoodItemDuration({ duration }: IFoodItemDurationProps) {
  const timeInfo = toTimeInfo(duration ?? new Date());
  return (
    <>
      {toPad(timeInfo.day)}/{toPad(timeInfo.month)}/{toPad(timeInfo.year)}{" "}
      {toPad(timeInfo.hours)}:{toPad(timeInfo.minutes)}:
      {toPad(timeInfo.seconds)}
    </>
  );
}
