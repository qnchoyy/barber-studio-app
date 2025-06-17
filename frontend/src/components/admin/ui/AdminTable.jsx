import { useState, useMemo, useCallback, useEffect } from "react";
import { FiChevronUp, FiChevronDown, FiSearch } from "react-icons/fi";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function AdminTable({
  columns,
  data = [],
  loading = false,
  searchable = true,
  searchPlaceholder = "Търсене...",
  emptyMessage = "Няма данни за показване",
}) {
  const [searchInput, setSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const searchTerm = useDebounce(searchInput, 300);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) => {
      return columns.some((column) => {
        if (column.accessor) {
          const value = row[column.accessor];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return false;
      });
    });
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = useCallback((key) => {
    if (!key) return;

    setSortConfig((prevConfig) => {
      let direction = "asc";
      if (prevConfig.key === key && prevConfig.direction === "asc") {
        direction = "desc";
      }
      return { key, direction };
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput("");
  }, []);

  const getSortIcon = useCallback(
    (key) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction === "asc" ? (
        <FiChevronUp className="w-4 h-4" />
      ) : (
        <FiChevronDown className="w-4 h-4" />
      );
    },
    [sortConfig]
  );

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Зареждане на данните...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {searchable && (
        <div className="p-6 border-b border-white/10">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column, index) => (
                <th
                  key={column.header || index}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider ${
                    column.accessor
                      ? "cursor-pointer hover:text-white transition-colors"
                      : ""
                  }`}
                  onClick={() => handleSort(column.accessor)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.header}</span>
                    {column.accessor && getSortIcon(column.accessor)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.length > 0 ? (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-white/5 transition-colors group"
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {column.cell ? (
                        column.cell(row)
                      ) : (
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                          {column.accessor ? row[column.accessor] : null}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="text-gray-500 text-4xl mb-4">📄</div>
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {searchTerm ? "Няма резултати" : "Няма данни"}
                  </h3>
                  <p className="text-gray-400">
                    {searchTerm
                      ? `Не намерихме резултати за "${searchTerm}"`
                      : emptyMessage}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="mt-4 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
                    >
                      Изчисти търсенето
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4 p-4">
        {sortedData.length > 0 ? (
          sortedData.map((row, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-xl p-4 border border-white/20"
            >
              {columns.map((column, colIndex) => {
                if (!column.header) return null;
                return (
                  <div
                    key={colIndex}
                    className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
                  >
                    <span className="text-gray-400 text-sm font-medium">
                      {column.header}:
                    </span>
                    <div className="text-white text-sm">
                      {column.cell
                        ? column.cell(row)
                        : column.accessor
                        ? row[column.accessor]
                        : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="text-gray-500 text-4xl mb-4">📄</div>
            <h3 className="text-white text-lg font-semibold mb-2">
              {searchTerm ? "Няма резултати" : "Няма данни"}
            </h3>
            <p className="text-gray-400">
              {searchTerm
                ? `Не намерихме резултати за "${searchTerm}"`
                : emptyMessage}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
              >
                Изчисти търсенето
              </button>
            )}
          </div>
        )}
      </div>

      {sortedData.length > 0 && (
        <div className="px-6 py-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Показване на {sortedData.length} от {data.length} записа
              {searchTerm && ` (филтрирани)`}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
              >
                Изчисти филтъра
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
