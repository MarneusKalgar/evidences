import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import addHours from "date-fns/addHours";

const ISO_HOURS_DIFF = 2;

const compose = (...fns: Function[]) => (initial: Date) => fns.reduce((val, fn) => fn(val), initial);

const getStartOfDay = (date: Date) => startOfDay(date ?? new Date());
const getEndOfDay = (date: Date) => endOfDay(date ?? new Date());
const addHoursForISOFormat = (date: Date) => addHours(date, ISO_HOURS_DIFF);

export const transformStartDate = compose(getStartOfDay, addHoursForISOFormat);
export const transformEndDate = compose(getEndOfDay, addHoursForISOFormat);
