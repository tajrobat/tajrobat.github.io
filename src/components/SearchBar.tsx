"use client";

import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-6 text-xl rounded-full border-2 border-gray-200 
          focus:ring-4 focus:ring-blue-100 focus:border-blue-400 shadow-lg
          hover:shadow-xl transition-shadow duration-200
          sm:text-lg md:text-xl lg:py-7 lg:text-2xl"
        />
      </div>
    </div>
  );
}
