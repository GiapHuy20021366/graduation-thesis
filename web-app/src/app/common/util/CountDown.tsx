import { Stack, SxProps, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { toLeftTime } from "../../../data";

interface ICountDownProps {
  time: number | string;
  sx?: SxProps<Theme>;
}

export default function CountDown({ time, sx }: ICountDownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

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

  const { days, hours, minutes, seconds } = toLeftTime(timeLeft);

  return (
    <Stack sx={sx}>
      {days < 10 ? `0${days}` : days} Days {" "} 
       {hours < 10 ? `0${hours}` : hours}:
      {minutes < 10 ? `0${minutes}` : minutes}:
      {seconds < 10 ? `0${seconds}` : seconds} Left
    </Stack>
  );
}
