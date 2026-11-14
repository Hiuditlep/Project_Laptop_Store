export default function SidebarFilter({
  minPrice,
  setMinPrice,
  selectedMaxPrice,
  setMaxPrice,
  highestPrice,
  priceStep,
  filterCpu,
  setFilterCpu,
  filterGpu,
  setFilterGpu,
  filterRam,
  setFilterRam,
  filterStorage,
  setFilterStorage,
  filterScreen,
  setFilterScreen,
  filterRefresh,
  setFilterRefresh,
}) {
  const toggleFilter = (state, setState, value) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value],
    );
  };

  const CheckboxItem = ({ label, state, setState, val }) => (
    <label className="flex items-center gap-3 cursor-pointer group mb-3 last:mb-0">
      <input
        type="checkbox"
        checked={state.includes(val)}
        onChange={() => toggleFilter(state, setState, val)}
        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
      />
      <span className="group-hover:text-red-600 transition text-sm text-gray-700">
        {label}
      </span>
    </label>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-120px)] overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b bg-gray-50 z-10 shrink-0">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          ></path>
        </svg>
        <h2 className="text-lg font-bold text-gray-800">Bộ lọc tìm kiếm</h2>
      </div>

      <div className="p-5 overflow-y-auto scrollbar-thin flex-1">
        {/* Khoảng giá */}
        <div className="mb-6">
          <div className="flex items-center justify-between border-b pb-1 mb-4">
            <h3 className="font-semibold text-gray-800">Khoảng giá</h3>
            <button
              type="button"
              onClick={() => {
                setMinPrice(5000000);
                setMaxPrice(null);
              }}
              className="text-xs text-red-600 hover:underline"
            >
              Đặt lại
            </button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-600">Giá thấp nhất</label>
                <span className="font-semibold text-red-600">
                  {minPrice.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <input
                type="range"
                min={5000000}
                max={highestPrice}
                step={priceStep}
                value={Math.min(minPrice, highestPrice)}
                onChange={(e) =>
                  setMinPrice(
                    Math.min(Number(e.target.value), selectedMaxPrice),
                  )
                }
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-600">Giá cao nhất</label>
                <span className="font-semibold text-red-600">
                  {selectedMaxPrice.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <input
                type="range"
                min={5000000}
                max={highestPrice}
                step={priceStep}
                value={selectedMaxPrice}
                onChange={(e) =>
                  setMaxPrice(Math.max(Number(e.target.value), minPrice))
                }
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* CPU */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Công nghệ CPU
          </h3>
          <CheckboxItem
            label="Intel Core Ultra"
            state={filterCpu}
            setState={setFilterCpu}
            val="Ultra"
          />
          <CheckboxItem
            label="Intel Core i9"
            state={filterCpu}
            setState={setFilterCpu}
            val="i9"
          />
          <CheckboxItem
            label="Intel Core i7"
            state={filterCpu}
            setState={setFilterCpu}
            val="i7"
          />
          <CheckboxItem
            label="Intel Core i5"
            state={filterCpu}
            setState={setFilterCpu}
            val="i5"
          />
          <CheckboxItem
            label="AMD Ryzen"
            state={filterCpu}
            setState={setFilterCpu}
            val="Ryzen"
          />
        </div>

        {/* GPU */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Card đồ họa rời (GPU)
          </h3>
          <CheckboxItem
            label="RTX 50 Series (Mới)"
            state={filterGpu}
            setState={setFilterGpu}
            val="RTX 50"
          />
          <CheckboxItem
            label="RTX 40 Series"
            state={filterGpu}
            setState={setFilterGpu}
            val="RTX 40"
          />
          <CheckboxItem
            label="RTX 30 Series"
            state={filterGpu}
            setState={setFilterGpu}
            val="RTX 30"
          />
          <CheckboxItem
            label="RTX 20 Series"
            state={filterGpu}
            setState={setFilterGpu}
            val="RTX 20"
          />
        </div>

        {/* RAM */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            RAM
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {["8", "12", "16", "24", "32", "64"].map((ram) => (
              <button
                key={ram}
                onClick={() => toggleFilter(filterRam, setFilterRam, ram)}
                className={`border py-1.5 px-2 rounded transition ${filterRam.includes(ram) ? "border-red-600 bg-red-50 text-red-600 font-bold" : "border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500"}`}
              >
                {ram}GB
              </button>
            ))}
          </div>
        </div>

        {/* SSD */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Ổ cứng SSD
          </h3>
          <CheckboxItem
            label="SSD 2 TB"
            state={filterStorage}
            setState={setFilterStorage}
            val="2048"
          />
          <CheckboxItem
            label="SSD 1 TB"
            state={filterStorage}
            setState={setFilterStorage}
            val="1024"
          />
          <CheckboxItem
            label="SSD 512 GB"
            state={filterStorage}
            setState={setFilterStorage}
            val="512"
          />
          <CheckboxItem
            label="SSD 256 GB"
            state={filterStorage}
            setState={setFilterStorage}
            val="256"
          />
        </div>

        {/* Màn hình */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Kích thước màn hình
          </h3>
          <CheckboxItem
            label="Dưới 14 inch"
            state={filterScreen}
            setState={setFilterScreen}
            val="<14"
          />
          <CheckboxItem
            label="Từ 14 - 15 inch"
            state={filterScreen}
            setState={setFilterScreen}
            val="14-15"
          />
          <CheckboxItem
            label="Từ 15 - 17 inch"
            state={filterScreen}
            setState={setFilterScreen}
            val="15-17"
          />
          <CheckboxItem
            label="Trên 17 inch"
            state={filterScreen}
            setState={setFilterScreen}
            val=">17"
          />
        </div>

        {/* Tần số quét */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Tần số quét
          </h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              { label: "≤ 60Hz", val: "60" },
              { label: "120Hz", val: "120" },
              { label: "144Hz", val: "144" },
              { label: "165Hz", val: "165" },
              { label: "240Hz+", val: "240+" },
            ].map((hz) => (
              <button
                key={hz.val}
                onClick={() =>
                  toggleFilter(filterRefresh, setFilterRefresh, hz.val)
                }
                className={`border py-1 px-3 rounded transition ${filterRefresh.includes(hz.val) ? "border-red-600 bg-red-50 text-red-600 font-bold" : "border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500"}`}
              >
                {hz.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
