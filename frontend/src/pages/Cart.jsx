export default function Cart({ cart, updateQuantity, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center text-xl mt-10">
        Giỏ hàng của bạn đang trống!
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center gap-4 w-1/2">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <h3 className="font-semibold">{item.name}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="w-8 text-center font-bold">{item.qty}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <div className="font-bold text-red-600 w-32 text-right">
              {(item.price * item.qty).toLocaleString("vi-VN")} đ
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 font-bold px-4"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <h3 className="text-xl font-bold">Tổng tiền:</h3>
        <p className="text-3xl font-bold text-red-600">
          {total.toLocaleString("vi-VN")} đ
        </p>
      </div>
      <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700">
        TIẾN HÀNH THANH TOÁN
      </button>
    </div>
  );
}
