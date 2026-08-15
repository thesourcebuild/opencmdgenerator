import type { CalSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: CalSpec): string {
  const month = spec.month.trim();
  const year = spec.year.trim();

  const parts: string[] = [];
  if (month !== "" && year !== "") {
    parts.push(`Display a calendar for month ${month} of ${year}`);
  } else if (year !== "") {
    parts.push(`Display a calendar for the year ${year}`);
  } else if (month !== "") {
    parts.push(`Display a calendar for month ${month} of the current year`);
  } else {
    parts.push("Display a calendar for the current month");
  }

  if (flagBool(spec, "threeMonths")) parts.push("showing the previous, current, and next month");
  if (flagBool(spec, "wholeYear")) parts.push("showing the entire year");
  if (flagBool(spec, "mondayFirst")) parts.push("with Monday as the first day of the week");
  if (flagBool(spec, "julian")) parts.push("showing Julian day-of-year numbers");

  return `${parts.join(", ")}.`;
}
