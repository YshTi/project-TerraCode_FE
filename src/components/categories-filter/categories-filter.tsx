"use client";

import {
  Dropdown,
  DropdownOption,
} from "@/components/dropdown/dropdown";
import { Category } from "@/types/category";

import css from "./categories-filter.module.css";

interface CategoriesFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  disabled?: boolean;
}

const ALL_CATEGORIES_VALUE = "all";

export function CategoriesFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  disabled = false,
}: CategoriesFilterProps) {
  const options: DropdownOption[] = [
    {
      value: ALL_CATEGORIES_VALUE,
      label: "Всі статті",
    },
    ...categories.map((category) => ({
      value: category._id,
      label: category.category,
    })),
  ];

  const selectedValue =
    selectedCategory ?? ALL_CATEGORIES_VALUE;

  const handleChange = (value: string) => {
    onCategoryChange(
      value === ALL_CATEGORIES_VALUE ? null : value,
    );
  };

  return (
    <div className={css.wrapper}>
      <p className={css.label}>Категорії</p>

      <div
        className={css.desktopList}
        role="group"
        aria-label="Фільтр статей за категоріями"
      >
        {options.map((option) => {
          const isActive = option.value === selectedValue;

          return (
            <button
              key={option.value}
              type="button"
              className={`${css.categoryButton} ${
                isActive ? css.active : ""
              }`}
              onClick={() => handleChange(option.value)}
              disabled={disabled}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className={css.mobileDropdown}>
        <Dropdown
          options={options}
          value={selectedValue}
          onChange={handleChange}
          ariaLabel="Категорії статей"
          disabled={disabled}
        />
      </div>
    </div>
  );
}