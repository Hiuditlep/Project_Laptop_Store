import { Link } from "react-router-dom";

export default function ProductCard({ item, addToCart }) {
  const productId = item.product_id || item.id;
  const productImage =
    item.image_url || item.image || "/placeholder-laptop.png";
  const productPrice = Number(item.price_vnd || item.price || 0);
  const ramText = item.ram_gb
    ? `${item.ram_gb}GB`
    : item.ram
      ? `${item.ram}`
      : "8GB";
  const storageText = item.ssd_gb
    ? `SSD ${item.ssd_gb}GB`
    : item.hdd_gb
      ? `HDD ${item.hdd_gb}GB`
      : item.ssd
        ? `SSD ${item.ssd}`
        : "SSD 512GB";
  const stock = item.stock_quantity !== undefined ? item.stock_quantity : 10;
  const inStock = stock > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-100 group relative">
      <Link to={`/product/${productId}`} className="p-3 flex-1 block">
        <div className="bg-white flex justify-center items-center h-40 mb-3 relative">
          <img
            src={productImage}
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x200?text=Laptop";
            }}
            className="max-h-full object-contain transition-transform group-hover:scale-105 absolute inset-0 w-full h-full"
          />
        </div>
        <div className="text-left">
          <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 hover:text-red-600 h-[40px] md:h-[48px]">
            {item.name}
          </h3>
          <div className="mt-2 text-[11px] md:text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
            RAM {ramText} | {storageText}
          </div>
          <p className="text-red-600 font-bold text-base md:text-lg">
            {productPrice.toLocaleString("vi-VN")} ₫
          </p>
        </div>
      </Link>
      <div className="p-3 pt-0 mt-auto">
        <button
          onClick={() => addToCart(item)}
          disabled={!inStock}
          className={`w-full font-medium py-1.5 rounded transition-colors text-sm uppercase ${inStock ? "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
        >
          {inStock ? "Thêm vào giỏ" : "Hết hàng"}
        </button>
      </div>
    </div>
  );
}
