import { DurationType } from ".";

export const convertDateToString = (date: Date | number): string => {
    if (typeof date == "number") return convertDateToString(new Date(date));
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export const convertStringToDate = (str: string): Date => {
    const year = parseInt(str.slice(0, 4), 10);
    const month = parseInt(str.slice(5, 7), 10) - 1; // Months are zero-based
    const day = parseInt(str.slice(8, 10), 10);
    const hours = parseInt(str.slice(11, 13), 10);
    const minutes = parseInt(str.slice(14, 16), 10);

    return new Date(year, month, day, hours, minutes);
}

export const toTime = (duration: DurationType | number): number => {
    if (typeof duration === "number") return duration;

    switch (duration) {
        case "ONE_DAY":
            return Date.now() + 1 * 24 * 60 * 60 * 1000;
        case "TWO_DAYS":
            return Date.now() + 2 * 24 * 60 * 60 * 1000;
        case "THREE_DAYS":
            return Date.now() + 3 * 24 * 60 * 60 * 1000;
        case "UTIL_MIDNIGHT":
            return toNextMidnight(new Date());
        case "CUSTOM":
            return Date.now() + 1 * 24 * 60 * 60 * 1000
        case "UTIL_LUNCH":
            return toNextLunch(new Date());
        case "UNKNOWN":
            return Date.now() + 1 * 24 * 60 * 60 * 1000;
    }
}

export interface TimeStamp {
    day: number;
    month: number;
    year: number;
    hours: number;
    minutes: number;
    seconds: number;
    ms: number;
}

export const toTimeInfo = (date: Date | number): TimeStamp => {
    if (typeof date === "number") return toTimeInfo(new Date(date));

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ms = date.getMilliseconds();

    return {
        day, month, year, hours, minutes, seconds, ms
    }
}

export const toNextMidnight = (date: Date | number): number => {
    const time = toTimeInfo(date);
    const nextMidNight = new Date(time.year, time.month - 1, time.day, 0, 0, 0, 0);
    nextMidNight.setDate(time.day + 1);
    return nextMidNight.getTime();
}

export const toNextLunch = (date: Date | number): number => {
    const time = toTimeInfo(date);
    const nextLunch = new Date(time.year, time.month - 1, time.day, 0, 0, 0, 0);
    nextLunch.setHours(12)
    if (time.hours > 12) nextLunch.setDate(time.day + 1);
    return nextLunch.getTime();
}

export const toLeftTime = (ms: number | string) => {
    const difference = typeof ms === "string" ? new Date(ms).getTime() : ms;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
        days,
        hours,
        minutes,
        seconds
    };
}