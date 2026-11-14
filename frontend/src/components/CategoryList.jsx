export default function CategoryList({ activeCategory, setActiveCategory }) {
  const categories = [
    {
      id: "gaming",
      name: "Gaming",
      img: "/Use_Demand/GamingLaptop.jpg",
      keyword: "gaming",
    },
    {
      id: "creator",
      name: "Đồ họa - Creator",
      img: "/Use_Demand/CreatorLaptop.jpg",
      keyword: "creator",
    },
    {
      id: "business",
      name: "Doanh nhân",
      img: "/Use_Demand/BusinessLaptop.jpg",
      keyword: "business",
    },
    {
      id: "ultrabook",
      name: "Mỏng nhẹ - Ultrabook",
      img: "/Use_Demand/UltrabookLaptop.jpg",
      keyword: "ultrabook",
    },
    {
      id: "general",
      name: "Phổ thông - Văn phòng",
      img: "/Use_Demand/GeneralLaptop.jpg",
      keyword: "general",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
      <div
        onClick={() => setActiveCategory("")}
        className="flex flex-col items-center gap-3 cursor-pointer group"
      >
        <div
          className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center p-2 transition transform duration-300 ${activeCategory === "" ? "bg-red-100 ring-2 ring-red-500" : "bg-gray-50 group-hover:-translate-y-1"}`}
        >
          <span className="font-bold text-gray-600">Tất cả</span>
        </div>
        <span
          className={`text-sm font-medium ${activeCategory === "" ? "text-red-600" : "text-gray-700"}`}
        >
          Bỏ lọc
        </span>
      </div>
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => setActiveCategory(cat.keyword)}
          className="flex flex-col items-center gap-3 cursor-pointer group"
        >
          <div
            className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center p-2 transition transform duration-300 ${activeCategory === cat.keyword ? "bg-red-100 ring-2 ring-red-500" : "bg-gray-50 group-hover:-translate-y-1"}`}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-full object-cover rounded-xl opacity-90 group-hover:opacity-100"
            />
          </div>
          <span
            className={`text-sm font-medium ${activeCategory === cat.keyword ? "text-red-600" : "text-gray-700"}`}
          >
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
}
