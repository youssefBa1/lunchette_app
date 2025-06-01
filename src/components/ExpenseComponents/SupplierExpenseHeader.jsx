import { IonIcon } from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  addCircleOutline,
  calendarOutline,
} from "ionicons/icons";

const SupplierExpenseHeader = ({
  selectedDate,
  setSelectedDate,
  handleAddExpense,
  dayNames,
  months,
  isDateRangeMode,
  setIsDateRangeMode,
  dateRange,
  setDateRange,
}) => {
  const currentDate = new Date(selectedDate);
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    if (isDateRangeMode) {
      setDateRange({
        startDate: today,
        endDate: today,
      });
    }
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 w-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 pb-4 md:pb-6 space-y-4 md:space-y-0">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 md:gap-5 w-full md:w-auto">
        <div
          className="rounded-3xl border-gray-200 border-2 px-3 py-2 md:p-4 hover:bg-slate-200 duration-300 cursor-pointer text-sm md:text-base"
          onClick={goToToday}
        >
          Aujourd'hui
        </div>
        {!isDateRangeMode && (
          <>
            <div
              className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
              onClick={() => navigateDate("prev")}
            >
              <IonIcon
                icon={chevronBackOutline}
                style={{ fontSize: "20px" }}
                className="md:text-2xl"
              />
            </div>
            <div
              className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
              onClick={() => navigateDate("next")}
            >
              <IonIcon
                icon={chevronForwardOutline}
                style={{ fontSize: "20px" }}
                className="md:text-2xl"
              />
            </div>
            <div className="font-medium text-base md:text-xl">
              {month} {year}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-center w-full md:w-auto space-x-4">
        <button
          onClick={() => setIsDateRangeMode(!isDateRangeMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            isDateRangeMode
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <IonIcon icon={calendarOutline} className="text-xl" />
          {isDateRangeMode ? "Mode Date Unique" : "Mode Plage de Dates"}
        </button>
        <IonIcon
          onClick={handleAddExpense}
          className="!blur-none hover:rotate-45 rounded-full duration-300 opacity-100 cursor-pointer"
          icon={addCircleOutline}
          style={{ fontSize: "35px", color: "#fca5a5" }}
        />
        {isDateRangeMode ? (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="border-2 rounded-3xl px-3 py-2 md:px-4 md:py-3 font-medium text-sm md:text-lg hover:bg-200 duration-300"
            />
            <span>à</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              className="border-2 rounded-3xl px-3 py-2 md:px-4 md:py-3 font-medium text-sm md:text-lg hover:bg-200 duration-300"
            />
          </div>
        ) : (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-2 rounded-3xl px-3 py-2 md:px-4 md:py-3 font-medium text-sm md:text-lg hover:bg-200 duration-300"
          />
        )}
      </div>
    </div>
  );
};

export default SupplierExpenseHeader;
