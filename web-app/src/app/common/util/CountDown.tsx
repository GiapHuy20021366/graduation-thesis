import { Stack, SxProps, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { toLeftTime } from "../../../data";
import { useI18nContext } from "../../../hooks";

interface ICountDownProps {
  time: number | string;
  sx?: SxProps<Theme>;
}

export default function CountDown({ time, sx }: ICountDownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const i18n = useI18nContext();
  const lang = i18n.of(CountDown);

  useEffect(() => {
    const timeout = setInterval(() => {
      if (typeof time === "string") {
        const nTime = new Date(time).getTime();
        setTimeLeft(nTime - Date.now());
      } else {
        setTimeLeft(time - Date.now());
      }
    }, 1000);
    return () => {
      clearInterval(timeout);
    };
  }, [time]);

  const { days, hours, minutes, seconds } = toLeftTime(Math.max(0, timeLeft));

  return (
    <Stack sx={sx}>
      {days < 10 ? `0${days}` : days} {lang("days")}{" "}
      {hours < 10 ? `0${hours}` : hours}:
      {minutes < 10 ? `0${minutes}` : minutes}:
      {seconds < 10 ? `0${seconds}` : seconds} {lang("left")}
    </Stack>
  );
}
