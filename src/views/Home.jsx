import { IonIcon } from "@ionic/react";
import NavBar from "../components/NavBar";
import { useState } from "react";
import AddOrderModal from "../components/AgendaComponents/addorderModal";
import {
  chevronBackOutline,
  chevronForwardOutline,
  addCircleOutline,
} from "ionicons/icons";
import Order from "../components/Orders";

const HomeView = () => {
  const [isAddModalShown, setIsAddModalShown] = useState(false);
  const handleAddModal = () => {
    setIsAddModalShown(!isAddModalShown);
  };

  const orders = [
    {
      id: "1",
      customerName: "Mme Sousou",
      orderTime: "10:35",
      customerNumber: "28256698",
      po: "10",
    },
    {
      id: "2",
      customerName: "Mme Sousou",
      orderTime: "8:35",
      customerNumber: "28256698",
      po: "8",
    },
    {
      id: "3",
      customerName: "Mme Sousou",
      orderTime: "8:35",
      customerNumber: "28256698",
      po: "8",
    },
    {
      id: "4",
      customerName: "Mme Sousou",
      orderTime: "12:35",
      customerNumber: "28256698",
      po: "12",
    },
  ];
  const addOrder = (order) => {
    orders.push(order);
  };

  return (
    <div className="h-auto max-w-screen relative ">
      <NavBar></NavBar>

      <div className="pt-28 w-full h-[10rem] flex flex-row items-center justify-between px-20">
        <div className="flex flex-row items-center space-x-5">
          <div className="rounded-3xl border-gray-200 border-2 p-4 hover:bg-slate-200 duration-300">
            Aujourd'hui
          </div>
          <div className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300">
            <IonIcon
              icon={chevronBackOutline}
              style={{ fontSize: "25px" }}
            ></IonIcon>
          </div>
          <div className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300">
            <IonIcon
              icon={chevronForwardOutline}
              style={{ fontSize: "25px" }}
            ></IonIcon>
          </div>
          <div className="font-medium text-xl">décembre 2024</div>
          <div className="font-medium text-xl text-green-200">
            Nbre de commande : 7
          </div>
        </div>
        <IonIcon
          onClick={handleAddModal}
          className="!blur-none ml-[38rem]  hover:rotate-45 rounded-full duration-300 opacity-100"
          icon={addCircleOutline}
          style={{ fontSize: "45px", color: "#fca5a5" }}
        ></IonIcon>
        <input
          type="date"
          className="border-2 rounded-3xl px-4 py-3 font-medium text-lg hover:bg-200 duration-300"
        />
      </div>
      <div className=" w-full  mt-5 flex items-center justify-center flex-col">
        <div className="text-gray-500 text-xs mb-3 font-bold">MER.</div>
        <div className="text-gray-500 text-lg font-bold">4</div>
      </div>
      <div className="h-auto w-1 border-r-2 absolute ml-[5rem]"></div>
      <div
        className={`${
          isAddModalShown == true
            ? ` opacity-50 blur-sm transition-all duration-300 pointer-events-none`
            : ``
        }min-w-full flex flex-col ml-10 transition-all duration-300`}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i}>
            <hr />
            <div className="h-24 w-[96vh] flex flex-row">
              <span>{`${8 + i}h`}</span>

              {orders
                .filter((order) => parseInt(order.po) === 8 + i)
                .map((order) => (
                  <Order key={order.id} order={order} />
                ))}
            </div>
            <hr />
          </div>
        ))}
      </div>
      <AddOrderModal showModal={isAddModalShown} func={handleAddModal} />
    </div>
  );
};
export default HomeView;
