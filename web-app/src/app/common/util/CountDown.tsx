import { Stack, SxProps, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { toLeftTime } from "../../../data";
import { useI18nContext } from "../../../hooks";

interface ICountDownProps {
  time: number | string | Date;
  sx?: SxProps<Theme>;
  enable?: boolean;
  second?: boolean;
}

export default function CountDown({
  time,
  sx,
  enable,
  second,
}: ICountDownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(
    new Date(time).getTime() - Date.now()
  );
  const i18n = useI18nContext();
  const lang = i18n.of(CountDown);

  useEffect(() => {
    if (!enable) return;
    const timeout = setInterval(() => {
      const _time = new Date(time);
      setTimeLeft(_time.getTime() - Date.now());
    }, 1000);
    return () => {
      clearInterval(timeout);
    };
  }, [enable, time]);

  const { days, hours, minutes, seconds } = toLeftTime(Math.max(0, timeLeft));

  return (
    <Stack sx={sx}>
      {days < 10 ? `0${days}` : days} {lang("days")}{" "}
      {hours < 10 ? `0${hours}` : hours}:
      {minutes < 10 ? `0${minutes}` : minutes}
      {second !== false && (
        <>
          :{seconds < 10 ? `0${seconds}` : seconds} {lang("left")}
        </>
      )}
    </Stack>
  );
}
