"use client";

import {
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import css from "./dropdown.module.css";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  ariaLabel,
  disabled = false,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownId = useId();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "ArrowDown" || event.key === "Enter") {
      event.preventDefault();
      setIsOpen(true);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`${css.dropdown} ${className}`}
    >
      <button
        type="button"
        className={`${css.trigger} ${isOpen ? css.triggerOpen : ""}`}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        disabled={disabled}
        onClick={() => setIsOpen((previous) => !previous)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selectedOption?.label}</span>

        <SpriteIcon
          id={isOpen ? "icon-arrow_up" : "icon-arrow_down"}
          width={24}
          height={24}
          className={css.arrow}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id={dropdownId}
          className={css.menu}
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value}>
                <button
                  type="button"
                  className={`${css.option} ${
                    isSelected ? css.optionActive : ""
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}