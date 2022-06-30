import { SearchIcon } from "@heroicons/react/solid";
import { FunctionComponent, useEffect, useRef } from "react";

type SearchProps = {
  query?: string;
  onChange: (query?: string) => void;
};

const Search: FunctionComponent<SearchProps> = ({ query, onChange }) => {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSlashKeydown = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === "/") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleSlashKeydown);

    return () => window.removeEventListener("keydown", handleSlashKeydown);
  }, []);

  return (
    <div className="items-cente relative flex w-full">
      <input
        ref={searchRef}
        id="search"
        name="search"
        type="text"
        placeholder="Search all datasets (Shortcut: Press the “/” key)"
        value={query}
        onChange={e => onChange(e.target.value)}
        className="block w-full border-0 pl-8 text-dim focus:ring-0"
      />
      <div className="absolute inset-y-0 left-0 flex items-center py-1.5 pr-1.5">
        <SearchIcon className="h-5 w-5 text-dim" />
      </div>
    </div>
  );
};

export default Search;
