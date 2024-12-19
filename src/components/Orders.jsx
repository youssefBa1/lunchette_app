const Order = ({ order, func }) => {
  return (
    <div
      className="bg-red-300 mt-2 h-20 w-auto ml-8 rounded-xl flex flex-col p-2 text-gray-600 font-bold cursor-pointer active:bg-slate-300"
      onClick={func}
    >
      <p>{order.customerName}</p>
      <p>{order.orderTime}</p>
      <p>{order.customerNumber}</p>
    </div>
  );
};

export default Order;
