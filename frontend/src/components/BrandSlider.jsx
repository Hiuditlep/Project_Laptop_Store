import { useRef } from "react";

export default function BrandSlider({ brands, activeBrand, setActiveBrand }) {
  const brandSliderRef = useRef(null);

  const scrollBrands = (direction) => {
    if (brandSliderRef.current) {
      brandSliderRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group mb-10">
      <button
        onClick={() => scrollBrands("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white shadow-md border w-10 h-10 rounded-full flex items-center justify-center hidden group-hover:flex hover:bg-gray-50 text-gray-600"
      >
        ❮
      </button>

      <div
        ref={brandSliderRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x pb-2"
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        <div
          onClick={() => setActiveBrand("")}
          className={`snap-start shrink-0 w-[140px] h-16 border rounded-lg flex items-center justify-center cursor-pointer transition ${activeBrand === "" ? "border-red-600 text-red-600 font-bold bg-red-50" : "border-gray-200 text-gray-700 hover:border-red-500"}`}
        >
          TẤT CẢ
        </div>
        {brands.map((brand, idx) => (
          <div
            key={idx}
            onClick={() => setActiveBrand(brand)}
            className={`snap-start shrink-0 w-[140px] h-16 border rounded-lg flex items-center justify-center cursor-pointer transition ${activeBrand === brand ? "border-red-600 bg-red-50" : "border-gray-200 hover:border-red-500"}`}
          >
            <img
              src={`/Laptop_Logo/${brand}.png`}
              alt={brand}
              className="max-h-8 max-w-[100px] object-contain transition-transform hover:scale-110"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="hidden font-bold uppercase tracking-wider text-gray-700">
              {brand}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollBrands("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white shadow-md border w-10 h-10 rounded-full flex items-center justify-center hidden group-hover:flex hover:bg-gray-50 text-gray-600"
      >
        ❯
      </button>
    </div>
  );
}
