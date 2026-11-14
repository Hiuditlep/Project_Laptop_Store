import { useState, useEffect } from "react";
// Import các component vừa tạo
import BrandSlider from "../components/BrandSlider";
import CategoryList from "../components/CategoryList";
import SidebarFilter from "../components/SidebarFilter";
import ProductCard from "../components/ProductCard";

export default function Home({ addToCart, searchTerm }) {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  // CÁC STATE BỘ LỌC
  const [activeBrand, setActiveBrand] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [filterRam, setFilterRam] = useState([]);
  const [filterStorage, setFilterStorage] = useState([]);
  const [filterScreen, setFilterScreen] = useState([]);
  const [filterRefresh, setFilterRefresh] = useState([]);
  const [filterCpu, setFilterCpu] = useState([]);
  const [filterGpu, setFilterGpu] = useState([]);
  const [minPrice, setMinPrice] = useState(5000000);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortOption, setSortOption] = useState("default");

  const priceStep = 1000000;
  const highestPrice = Math.max(
    5000000,
    Math.ceil(
      allProducts.reduce(
        (highest, product) =>
          Math.max(highest, Number(product.price_vnd || product.price || 0)),
        0,
      ) / priceStep,
    ) * priceStep,
  );
  const selectedMaxPrice = maxPrice ?? highestPrice;

  // FETCH DATA
  useEffect(() => {
    fetch(
      `https://project-laptop-store-9zsr.onrender.com/api/products?search=${searchTerm || ""}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllProducts(data);
          setFilteredProducts(data);
          setBrands([...new Set(data.map((p) => p.brand))].filter(Boolean));
        } else {
          setAllProducts([]);
          setFilteredProducts([]);
        }
      })
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, [searchTerm]);

  // LOGIC LỌC
  useEffect(() => {
    let result = [...allProducts];

    if (activeBrand)
      result = result.filter(
        (p) => p.brand?.toLowerCase() === activeBrand.toLowerCase(),
      );
    if (activeCategory)
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(activeCategory) ||
          p.category?.toLowerCase().includes(activeCategory),
      );

    result = result.filter((p) => {
      const price = Number(p.price_vnd || p.price || 0);
      return price >= minPrice && price <= selectedMaxPrice;
    });

    if (filterRam.length > 0)
      result = result.filter((p) =>
        filterRam.includes(String(p.ram_gb || p.ram)),
      );
    if (filterStorage.length > 0)
      result = result.filter((p) =>
        filterStorage.includes(String(p.ssd_gb || p.ssd)),
      );
    if (filterCpu.length > 0)
      result = result.filter((p) =>
        filterCpu.some((k) =>
          (p.cpu || "").toLowerCase().includes(k.toLowerCase()),
        ),
      );
    if (filterGpu.length > 0)
      result = result.filter((p) =>
        filterGpu.some((k) =>
          (p.gpu || "").toLowerCase().includes(k.toLowerCase()),
        ),
      );

    if (filterScreen.length > 0) {
      result = result.filter((p) => {
        const size = Number(p.screen_size_in);
        if (!size) return false;
        return filterScreen.some((cond) => {
          if (cond === "<14") return size < 14;
          if (cond === "14-15") return size >= 14 && size < 15.5;
          if (cond === "15-17") return size >= 15.5 && size <= 17.3;
          if (cond === ">17") return size > 17.3;
          return false;
        });
      });
    }

    if (filterRefresh.length > 0) {
      result = result.filter((p) => {
        const hz = Number(p.refresh_rate_hz);
        if (!hz) return false;
        return filterRefresh.some((cond) => {
          if (cond === "60") return hz <= 60;
          if (cond === "120") return hz === 120;
          if (cond === "144") return hz === 144;
          if (cond === "165") return hz === 165;
          if (cond === "240+") return hz >= 240;
          return false;
        });
      });
    }

    setFilteredProducts(result);
  }, [
    allProducts,
    activeBrand,
    activeCategory,
    filterRam,
    filterStorage,
    filterScreen,
    filterRefresh,
    filterCpu,
    filterGpu,
    minPrice,
    selectedMaxPrice,
  ]);

  // LOGIC SẮP XẾP
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.price_vnd || a.price || 0);
    const priceB = Number(b.price_vnd || b.price || 0);
    if (sortOption === "price-asc") return priceA - priceB;
    if (sortOption === "price-desc") return priceB - priceA;
    if (sortOption === "name-asc")
      return (a.name || "").localeCompare(b.name || "", "vi");
    return 0;
  });

  return (
    <div className="w-full pb-10">
      <section className="bg-white rounded-xl shadow-sm p-6 mb-6 mt-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Thương hiệu nổi bật
        </h2>
        <BrandSlider
          brands={brands}
          activeBrand={activeBrand}
          setActiveBrand={setActiveBrand}
        />

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">
          Nhu cầu sử dụng
        </h2>
        <CategoryList
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </section>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* CỘT BỘ LỌC BÊN TRÁI */}
        <SidebarFilter
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          selectedMaxPrice={selectedMaxPrice}
          setMaxPrice={setMaxPrice}
          highestPrice={highestPrice}
          priceStep={priceStep}
          filterCpu={filterCpu}
          setFilterCpu={setFilterCpu}
          filterGpu={filterGpu}
          setFilterGpu={setFilterGpu}
          filterRam={filterRam}
          setFilterRam={setFilterRam}
          filterStorage={filterStorage}
          setFilterStorage={setFilterStorage}
          filterScreen={filterScreen}
          setFilterScreen={setFilterScreen}
          filterRefresh={filterRefresh}
          setFilterRefresh={setFilterRefresh}
        />

        {/* LƯỚI SẢN PHẨM BÊN PHẢI */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold uppercase text-gray-800 border-b-2 border-red-600 inline-block pb-1 mb-[-9px]">
              LAPTOP NỔI BẬT
            </h2>
            <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:border-red-500"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="name-asc">Tên A - Z</option>
              </select>
              <span className="text-gray-500">
                Tìm thấy{" "}
                <strong className="text-red-600 text-lg">
                  {filteredProducts.length}
                </strong>{" "}
                kết quả
              </span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-16 bg-white rounded-lg shadow-sm border flex flex-col items-center">
              <p className="text-lg font-medium">
                Rất tiếc, không tìm thấy laptop nào phù hợp với bộ lọc!
              </p>
              <button
                onClick={() => {
                  setActiveBrand("");
                  setActiveCategory("");
                  setFilterStorage([]);
                  setFilterRam([]);
                  setFilterScreen([]);
                  setFilterRefresh([]);
                  setFilterCpu([]);
                  setFilterGpu([]);
                  setMinPrice(5000000);
                  setMaxPrice(null);
                }}
                className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-md font-semibold hover:bg-red-100 transition"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {sortedProducts.map((item) => (
                // Gọi component ProductCard đã tách
                <ProductCard
                  key={item.product_id || item.id}
                  item={item}
                  addToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
