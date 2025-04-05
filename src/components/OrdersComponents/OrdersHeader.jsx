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
    <div className="pt-28 w-full h-[10rem] flex flex-row items-center justify-between px-20">
      <div className="flex flex-row items-center space-x-5">
        <div
          className="rounded-3xl border-gray-200 border-2 p-4 hover:bg-slate-200 duration-300 cursor-pointer"
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
            style={{ fontSize: "25px" }}
          ></IonIcon>
        </div>
        <div
          className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
          onClick={() => navigateDate("next")}
        >
          <IonIcon
            icon={chevronForwardOutline}
            style={{ fontSize: "25px" }}
          ></IonIcon>
        </div>
        <div className="font-medium text-xl">
          {month} {year}
        </div>
        <div className="font-medium text-xl text-green-200">
          Nbre de commande : {orders.length}
        </div>
      </div>
      <IonIcon
        onClick={handleAddModal}
        className="!blur-none ml-[38rem] hover:rotate-45 rounded-full duration-300 opacity-100"
        icon={addCircleOutline}
        style={{ fontSize: "45px", color: "#fca5a5" }}
      ></IonIcon>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border-2 rounded-3xl px-4 py-3 font-medium text-lg hover:bg-200 duration-300"
      />
    </div>
  );
};

export default OrdersHeader;
