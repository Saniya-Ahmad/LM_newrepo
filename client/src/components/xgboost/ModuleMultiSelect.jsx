import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const ModuleMultiSelect = ({
  predictions = [],
  selectedModules,
  setSelectedModules,
}) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (feature) => {
    if (selectedModules.includes(feature)) {
      setSelectedModules(
        selectedModules.filter((f) => f !== feature)
      );
    } else {
      setSelectedModules([
        ...selectedModules,
        feature,
      ]);
    }
  };

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
      >
        <span className="font-medium text-slate-900 dark:text-white">
          Features
        </span>

        <span className="text-slate-500 dark:text-slate-400 text-sm">
          {selectedModules.length} selected
        </span>

        <ChevronDown
          size={18}
          className="text-slate-600 dark:text-slate-300"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 p-3 overflow-y-auto max-h-80">

          <div className="space-y-2">

            {predictions.map((item) => (
              <label
                key={item.feature}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedModules.includes(item.feature)}
                  onChange={() => handleToggle(item.feature)}
                />

                <span className="text-sm text-slate-700 dark:text-slate-200">
                  {item.displayName}
                </span>
              </label>
            ))}

            {predictions.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No features available
              </p>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default ModuleMultiSelect;