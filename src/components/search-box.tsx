import { Search } from "lucide-react";

export function SearchBox({
  defaultValue = "",
  type = "repositories",
  large = false,
}: {
  defaultValue?: string;
  type?: "users" | "repositories";
  large?: boolean;
}) {
  return (
    <form
      action="/search"
      method="get"
      className={`search-box ${large ? "search-box-large" : ""}`}
      role="search"
    >
      <input type="hidden" name="type" value={type} />
      <Search size={large ? 23 : 19} aria-hidden="true" />
      <label
        className="sr-only"
        htmlFor={large ? "home-search" : "results-search"}
      >
        Search GitHub {type === "users" ? "developers" : "repositories"}
      </label>
      <input
        id={large ? "home-search" : "results-search"}
        name="q"
        defaultValue={defaultValue}
        placeholder={
          type === "users"
            ? "Search developers by name or username"
            : "Search repositories, topics, or technologies"
        }
        required
        maxLength={100}
      />
      <button type="submit">Search</button>
    </form>
  );
}
