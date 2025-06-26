import { Calendar as CalendarIcon } from "lucide-react";
import {
  formatDisplayDate,
  parseDateString,
  formatDateToString,
} from "@/utils/dataLoader";
import { Calendar } from "@/components/ui/calendar";

const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

function DatePicker({
  selectedDate,
  onDateChange,
  availableDates,
}: {
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates: string[];
}) {

  const availableDateObjects = availableDates.map(parseDateString);

  const selectedDateObject = selectedDate
    ? parseDateString(selectedDate)
    : undefined;

  const disabledDates = (date: Date) => {
    return !availableDateObjects.some((availableDate) =>
      isSameDate(availableDate, date)
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(formatDateToString(date));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <CalendarIcon className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Select Date</h2>
      </div>

      {/* calendar interface */}
      <div className="mb-4">
        <Calendar
          mode="single"
          selected={selectedDateObject}
          onSelect={handleDateSelect}
          disabled={disabledDates}
          className="rounded-md border w-full"
        />
      </div>

      {/* selected date display */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Selected:</span>{" "}
            {formatDisplayDate(selectedDate)}
          </p>
        </div>
      )}

      {/* available dates count */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        {availableDates.length} available date
        {availableDates.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

export default DatePicker;
