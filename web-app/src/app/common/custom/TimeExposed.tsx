import { toTimeInfo } from "../../../data";

const toPad = (num: number): string => {
  return num < 10 ? "0" + num : String(num);
};

interface ITimeExposedProps {
  time?: number | string | Date;
  date?: boolean;
  hour?: boolean;
}

export default function TimeExposed({ time, date, hour }: ITimeExposedProps) {
  const timeInfo = toTimeInfo(time ?? new Date());
  return (
    <>
      {date !== false && (
        <>
          {toPad(timeInfo.day)}/{toPad(timeInfo.month)}/{toPad(timeInfo.year)}
        </>
      )}
      {hour !== false && (
        <>
          {" "}
          {toPad(timeInfo.hours)}:{toPad(timeInfo.minutes)}:
          {toPad(timeInfo.seconds)}
        </>
      )}
    </>
  );
}
