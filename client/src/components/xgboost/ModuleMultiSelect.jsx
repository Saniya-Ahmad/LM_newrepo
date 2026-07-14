import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const ModuleMultiSelect = ({
  predictions = [],
  selectedModules,
  setSelectedModules,
}) => {

  const [open, setOpen] = useState(false);

  const allModules = predictions.map(
    (item) => item.module
  );

  const handleToggle = (module) => {

    if (selectedModules.includes(module)) {

      setSelectedModules(
        selectedModules.filter(
          (m) => m !== module
        )
      );

    } else {

      setSelectedModules([
        ...selectedModules,
        module,
      ]);

    }

  };

  return (

    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 border rounded-xl px-4 py-2 bg-white shadow-sm hover:bg-slate-50"
      >

        <span className="font-medium">
          Modules
        </span>

        <span className="text-slate-500 text-sm">
          {selectedModules.length} selected
        </span>

        <ChevronDown size={18} />

      </button>

      {open && (

        <div className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white rounded-xl shadow-lg border z-50 p-3 overflow-y-auto max-h-80">

          <div className="space-y-2">

            {allModules.map((module) => (

              <label
                key={module}
                className="flex items-center gap-3 cursor-pointer"
              >

                <input
                  type="checkbox"
                  checked={selectedModules.includes(module)}
                  onChange={() => handleToggle(module)}
                />

                <span className="text-sm">
                  {module}
                </span>

              </label>

            ))}

            {allModules.length === 0 && (

              <p className="text-sm text-slate-500">
                No modules available
              </p>

            )}

          </div>

        </div>

      )}

    </div>

  );

};

export default ModuleMultiSelect;