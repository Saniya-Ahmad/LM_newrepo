import { useState } from "react";

const LicenseDetails = () => {
  const [licenses, setLicenses] = useState([
    {
      id: 1,
      license: "Microsoft Office 365",
      program: "Office Suite",
      sku: "O365-PROF",
      description: "Professional Office Suite",
      currentQty: 50,
      customerLicenses: 45,
    },
    {
      id: 2,
      license: "Adobe Creative Cloud",
      program: "Creative Suite",
      sku: "ACC-2024",
      description: "Complete Creative Cloud Package",
      currentQty: 30,
      customerLicenses: 28,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    license: "",
    program: "",
    sku: "",
    description: "",
    currentQty: "",
    customerLicenses: "",
  });

  const resetForm = () => {
    setFormData({
      license: "",
      program: "",
      sku: "",
      description: "",
      currentQty: "",
      customerLicenses: "",
    });
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (license) => {
    setFormData(license);
    setEditingId(license.id);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["currentQty", "customerLicenses"].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleSave = () => {
    if (!formData.license || !formData.program || !formData.sku) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingId) {
      setLicenses((prev) =>
        prev.map((item) => (item.id === editingId ? { ...formData, id: editingId } : item))
      );
    } else {
      setLicenses((prev) => [
        ...prev,
        {
          ...formData,
          id: Math.max(...prev.map((p) => p.id), 0) + 1,
        },
      ]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this license?")) {
      setLicenses((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">License Details</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and track all software licenses
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition transform hover:scale-105"
        >
          + Add License
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b-2 border-slate-200 dark:border-slate-600">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  License
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Program
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Current Qty
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Customer Licenses
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {licenses.length > 0 ? (
                licenses.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-slate-50 dark:bg-slate-800"
                    } border-b border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {item.license}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {item.program}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                        {item.currentQty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium">
                        {item.customerLicenses}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition font-medium text-xs whitespace-nowrap"
                        >
                          ✎ Edit
                        </button>
                       
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition font-medium text-xs whitespace-nowrap"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-600 dark:text-slate-400">
                    No licenses found. Add your first license to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit License" : "Add New License"}
              </h2>
            </div>

            <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  License Name *
                </label>
                <input
                  type="text"
                  name="license"
                  value={formData.license}
                  onChange={handleInputChange}
                  placeholder="e.g., Microsoft Office 365"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Program *
                </label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  placeholder="e.g., Office Suite"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g., O365-PROF"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description"
                  rows="2"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Current Qty
                  </label>
                  <input
                    type="number"
                    name="currentQty"
                    value={formData.currentQty}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Customer Licenses
                  </label>
                  <input
                    type="number"
                    name="customerLicenses"
                    value={formData.customerLicenses}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseDetails;
