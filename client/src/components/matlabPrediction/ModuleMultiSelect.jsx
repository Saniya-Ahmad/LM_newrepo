import React from "react";

const ModuleMultiSelect = ({
  predictions = [],
  selectedModules = [],
  setSelectedModules,
}) => {

  const modules = predictions.map(
    (item) => item.module
  );


  const handleChange = (module) => {

    if (selectedModules.includes(module)) {

      setSelectedModules(
        selectedModules.filter(
          (item) => item !== module
        )
      );

    } else {

      setSelectedModules([
        ...selectedModules,
        module,
      ]);

    }

  };


  const selectAll = () => {
    setSelectedModules(modules);
  };


  const clearAll = () => {
    setSelectedModules([]);
  };


  return (
    <div className="w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5">

      <div className="flex justify-between items-center mb-4">

        <h3 className="font-semibold text-slate-900 dark:text-white">
          Select Modules
        </h3>

      </div>


      <div className="flex gap-2 mb-4">

        <button
          onClick={selectAll}
          className="px-3 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          Select All
        </button>


        <button
          onClick={clearAll}
          className="px-3 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          Clear
        </button>

      </div>


      <div className="space-y-3 max-h-[350px] overflow-y-auto">

        {modules.map((module) => (

          <label
            key={module}
            className="flex items-center gap-3 cursor-pointer"
          >

            <input
              type="checkbox"
              checked={
                selectedModules.includes(module)
              }
              onChange={() =>
                handleChange(module)
              }
              className="w-4 h-4 accent-blue-600"
            />


            <span className="text-sm text-slate-700 dark:text-slate-300 break-all">

              {module}

            </span>


          </label>

        ))}


        {modules.length === 0 && (

          <p className="text-sm text-slate-500">
            No modules available
          </p>

        )}

      </div>


      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">

        <p className="text-xs text-slate-500 dark:text-slate-400">

          Selected: {selectedModules.length}

        </p>

      </div>


    </div>
  );
};


export default ModuleMultiSelect;