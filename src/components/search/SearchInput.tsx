import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder = "Search" }: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg bg-secondary transition-all",
        isFocused && "ring-1 ring-border"
      )}
    >
      <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="flex-shrink-0 w-4 h-4 rounded-full bg-muted-foreground flex items-center justify-center"
        >
          <X className="w-3 h-3 text-secondary" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
