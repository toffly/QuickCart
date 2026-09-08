const FilterPanel = ({
  categories,
  category,
  minPrice,
  maxPrice,
  updateFilter,
  clearFilters,
  hasFilters,
}: any) => {
  const categoriesWithAll = [
    { slug: "", name: "All Categories" },
    ...categories,
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-app-green mb-3"></h3>
        <div className="space-y-1.5">
          {categoriesWithAll.map((c: any) => (
            <button
              onClick={() => updateFilter("category", c.slug)}
              key={c.slug}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all ${category === c.slug ? "bg-app-green text-white" : "text-app-text-light hover:bg-app-cream"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
