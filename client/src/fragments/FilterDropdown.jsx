import { Select, TextInput } from "flowbite-react";
import PropTypes from "prop-types";
import { selectTheme, textTheme } from "../context/CustomThemes";
import { useFunction } from "../context/Functions";

function FilterDropdown({
  sortOptions,
  filterOptions,
  sort,
  filter,
  sortItems,
  filterItems,
  query,
  searchItem,
}) {
  const { capitalize } = useFunction();
  return (
    <div className="grid items-center gap-2 grid-cols-[1fr_1fr] xl:flex">
      <div className="flex flex-col items-start md:flex-row md:items-center gap-2 w-full row-[2/3] xl:w-fit">
        <label
          htmlFor="sort"
          className="w-full md:w-1/2 xl:w-fit xl:whitespace-nowrap"
        >
          Sort By:{" "}
        </label>
        <Select
          theme={selectTheme}
          id="sort"
          size="sm"
          onChange={(e) => sortItems(e.target.value)}
          className="w-full md:w-1/2 xl:w-[100px]"
        >
          <option defaultChecked selected={sort === "normal"} value="normal">
            None
          </option>
          {sortOptions.map((choice) => {
            return (
              <option key={choice} selected={sort === choice} value={choice}>
                {capitalize(choice.split("_")[0]) + " "}
                {choice.split("_")[1] === "asc" ? <>&#8593;</> : <>&#8595;</>}
              </option>
            );
          })}
        </Select>
      </div>
      <div className="flex flex-col items-start md:flex-row md:items-center gap-2 w-full row-[2/3] xl:w-fit">
        <label
          htmlFor="sort"
          className="w-full md:w-1/2 xl:w-fit xl:whitespace-nowrap"
        >
          Categorized By:{" "}
        </label>
        <Select
          theme={selectTheme}
          id="filter"
          size="sm"
          onChange={(e) => filterItems(e.target.value)}
          className="w-full md:w-1/2 xl:w-[160px]"
        >
          <option defaultChecked selected={filter === "all"} value="all">
            None
          </option>
          {filterOptions.map((choice) => {
            return (
              <option key={choice} selected={filter === choice} value={choice}>
                {capitalize(choice)}
              </option>
            );
          })}
        </Select>
      </div>
      <TextInput
        id="search"
        className="w-full col-[1/3] xl:col-[4/9]"
        onChange={(e) => searchItem(e.target.value)}
        type="text"
        sizing="md"
        placeholder={`Search here`}
        value={query}
        required
        theme={textTheme}
      />
    </div>
  );
}

FilterDropdown.propTypes = {
  sortOptions: PropTypes.array,
  filterOptions: PropTypes.array,
  sort: PropTypes.string,
  filter: PropTypes.string,
  query: PropTypes.string,
  sortItems: PropTypes.func,
  filterItems: PropTypes.func,
  searchItem: PropTypes.func,
};

export default FilterDropdown;
