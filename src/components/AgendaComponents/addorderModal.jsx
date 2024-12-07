import { useState } from "react";
import ModalInput from "./ModalInput";

const AddOrderModal = ({ showModal, func }) => {
  // Use state to track the index
  const [index, setIndex] = useState(1);
  const [clientName, setClientName] = useState("");
  const [clientPhoneNumber, setClientPhoneNumber] = useState("");
  const [orderTime, setOrderTime] = useState();
  const [orderDate, setOrderDate] = useState();

  const handleClientName = (e) => {
    console.log(clientName);
    setClientName(e.target.value);
  };

  const increaseOrderField = () => {
    setIndex(index + 1); // Increment index by 1
  };

  const decreaseOrderField = () => {
    if (index > 0) {
      setIndex(index - 1); // Decrement index by 1
    }
  };
  console.log(clientName);

  return (
    <form action="" method="post">
      <div
        className={`bg-[#f0f4f9] shadow-2xl transform flex flex-col items-center space-y-6 p-4 absolute h-[30%] w-1/4 top-[10%] left-[40%] rounded-3xl backdrop-blur-md 
  transition-all duration-200  overflow-y-scroll overflow-x-hidden scrollbar-hide
  ${showModal ? "opacity-100 scale-100" : "opacity-100 scale-0"}`}
      >
        <ModalInput
          name={"nomClient"}
          text={"Nom De Client"}
          type={"text"}
          onChange={(e) => {
            setClientName(e.target.value);
          }}
        />
        <ModalInput
          name={"phoneNumber"}
          text={"Numero De Telephone"}
          type={"text"}
          onChange={(e) => {
            setClientPhoneNumber(e.target.value);
          }}
        />

        <div className="relative z-0 w-[100%] mb-5 group ml-[72px] mt-60">
          <ModalInput
            name={"orderDate"}
            text={null}
            type={"date"}
            onChange={(e) => {
              setOrderDate(e.target.value);
            }}
          />
        </div>
        <div className="relative z-0 w-[100%] mb-5 group ml-[72px] mt-60">
          <ModalInput
            name={"orderTime"}
            text={null}
            type={"time"}
            onChange={(e) => {
              setOrderTime(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-row ">
          <div className="w-3/5 ml-8">
            <ModalInput name={"article"} text={"Article-1"} type={"text"} />
          </div>
          <div className="w-1/5">
            <ModalInput name={"articleQ"} text={"Nbre"} type={"number"} />
          </div>
          <div
            className="w-8 h-8 bg-green-300 rounded-full mt-4 flex items-center justify-center text-xl hover:bg-green-500 duration-200"
            onClick={increaseOrderField} // Updated to use state updater function
          >
            +
          </div>
          <div>
            <div
              className="w-8 h-8 bg-red-300 rounded-full mt-4 flex items-center justify-center text-xl ml-1 hover:bg-red-500 duration-200 "
              onClick={decreaseOrderField} // Updated to use state updater function
            >
              -
            </div>
          </div>
        </div>
        {Array.from({ length: index }).map((_, i) => {
          return (
            <div className="flex flex-row " key={i}>
              <div className="w-3/5 ml-8">
                <ModalInput
                  name={`article-${i}`}
                  text={`Article-${i + 2}`}
                  type={"text"}
                />
              </div>
              <div className="w-1/5">
                <ModalInput
                  name={`articleQ-${i}`}
                  text={"Nbre"}
                  type={"number"}
                />
              </div>
              <div
                className="w-8 h-8 bg-green-300 rounded-full mt-4 flex items-center justify-center text-xl hover:bg-green-500 duration-200"
                onClick={increaseOrderField} // Updated to use state updater function
              >
                +
              </div>
              <div>
                <div
                  className="w-8 h-8 bg-red-300 rounded-full mt-4 flex items-center justify-center text-xl ml-1 hover:bg-red-500 duration-200 "
                  onClick={decreaseOrderField} // Updated to use state updater function
                >
                  -
                </div>
              </div>
            </div>
          );
        })}
        <div className="relative z-0 w-[80%] mb-5 group">
          <textarea
            name="details"
            id="details"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-rose-300 peer"
          ></textarea>
          <label
            htmlFor="details"
            className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-rose-300  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            details de commande
          </label>
        </div>
        <div
          className="rounded-3xl bg-green-400 border-green-200 border-2 p-4 hover:bg-green-200 duration-300 cursor-pointer"
          onClick={func}
        >
          Ajouter commande {}
        </div>
      </div>
    </form>
  );
};

export default AddOrderModal;
