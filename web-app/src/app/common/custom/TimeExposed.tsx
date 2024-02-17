import { toTimeInfo } from "../../../data";

const toPad = (num: number): string => {
  return num < 10 ? "0" + num : String(num);
};

interface ITimeExposedProps {
  time?: number | string | Date;
}

export default function TimeExposed({ time }: ITimeExposedProps) {
  const timeInfo = toTimeInfo(time ?? new Date());
  return (
    <>
      {toPad(timeInfo.day)}/{toPad(timeInfo.month)}/{toPad(timeInfo.year)}{" "}
      {toPad(timeInfo.hours)}:{toPad(timeInfo.minutes)}:
      {toPad(timeInfo.seconds)}
    </>
  );
}
