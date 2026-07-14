import { useState } from "react";
import api from "../api";

export default function DashboardForm() {
  const [form, setForm] = useState({
    license: "",
    product: "",
    network: "",
    mac: "",
    ip: "",
    screenshot: null,
  });

  const productsMap = {
    "Microsoft Windows Server": ["Server 2019", "Server 2022"],
    "Microsoft Office": [
      "MS Excel",
      "MS Word",
      "MS PowerPoint",
      "Program 1",
      "Program 2",
      "Program 3",
      "Program 4",
      "Program 5",
    ],
    "SQL Server": ["SQL Dev", "SQL Enterprise", "SQL Express"],
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    setForm({
      ...form,
      screenshot: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Screenshot validation
    if (!form.screenshot) {
      alert("Please upload a screenshot before submitting.");
      return;
    }

    try {
      await api.post(
        "/license/submit",
        {
          license: form.license,
          product: form.product,
          network: form.network,
          mac: form.mac,
          ip: form.ip,
          screenshot: form.screenshot.name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("License request submitted!");

      // Reset form after successful submission
      setForm({
        license: "",
        product: "",
        network: "",
        mac: "",
        ip: "",
        screenshot: null,
      });

      // Reset file input
      document.getElementById("screenshot-input").value = "";
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Submission failed"
      );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto card-surface p-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-950 dark:text-slate-100">
          License Request
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Submit a new license request for review.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* License & Product */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-400 mb-1">
                License Type
              </label>

              <select
                name="license"
                value={form.license}
                onChange={(e) => {
                  setForm({
                    ...form,
                    license: e.target.value,
                    product: "",
                  });
                }}
                required
                className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Select License</option>
                <option value="Microsoft Windows Server">
                  Microsoft Windows Server
                </option>
                <option value="Microsoft Office">
                  Microsoft Office
                </option>
                <option value="SQL Server">
                  SQL Server
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-400 mb-1">
                Product
              </label>

              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                disabled={!form.license}
                required
                className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Select Product</option>

                {form.license &&
                  productsMap[form.license].map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Network & Screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-400 mb-1">
                Network Type
              </label>

              <select
                name="network"
                value={form.network}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Select Network Type</option>
                <option value="LAN">LAN</option>
                <option value="WiFi">WiFi</option>
                <option value="VPN">VPN</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-400 mb-1">
                Screenshot <span className="text-red-500">*</span>
              </label>

              <input
                id="screenshot-input"
                type="file"
                required
                accept="image/*"
                onChange={handleFile}
                className="w-full text-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          {/* MAC & IP */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm text-slate-700 dark:text-slate-400 mb-1">
      MAC Address <span className="text-red-500">*</span>
    </label>

    <input
      type="text"
      name="mac"
      value={form.mac}
      placeholder="Enter MAC Address"
      onChange={handleChange}
      required
      className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    />
  </div>

  <div>
    <label className="block text-sm text-slate-700 dark:text-slate-400 mb-1">
      IP Address <span className="text-red-500">*</span>
    </label>

    <input
      type="text"
      name="ip"
      value={form.ip}
      placeholder="Enter IP Address"
      onChange={handleChange}
      required
      className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    />
  </div>
</div>
          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}