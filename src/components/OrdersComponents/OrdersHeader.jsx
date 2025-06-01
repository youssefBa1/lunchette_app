import { IonIcon } from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  addCircleOutline,
} from "ionicons/icons";

const OrdersHeader = ({
  selectedDate,
  setSelectedDate,
  orders,
  handleAddModal,
  dayNames,
  months,
}) => {
  const currentDate = new Date(selectedDate);
  const dayName = dayNames[currentDate.getDay()];
  const dayNumber = currentDate.getDate();
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
    setSelectedDate(new Date().toISOString().split("T")[0]);
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
        <div className="font-medium text-sm md:text-xl text-green-200">
          Nbre de commande : {orders.length}
        </div>
      </div>

      <div className="flex items-center justify-center w-full md:w-auto space-x-4">
        <IonIcon
          onClick={() => handleAddModal(null)}
          className="!blur-none hover:rotate-45 rounded-full duration-300 opacity-100 cursor-pointer"
          icon={addCircleOutline}
          style={{ fontSize: "35px", color: "#fca5a5" }}
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border-2 rounded-3xl px-3 py-2 md:px-4 md:py-3 font-medium text-sm md:text-lg hover:bg-200 duration-300"
        />
      </div>
    </div>
  );
};

export default OrdersHeader;
