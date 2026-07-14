export const statsData = {
  totalLicenses: 520,
  licenseTypes: 12,
  totalLabs: 5,
  totalConsumers: 1620,
};

export const licenseDistribution = [
  {
    name: "MS Office",
    value: 120,
    programs: [
      { name: "Excel", users: 60 },
      { name: "Word", users: 50 },
      { name: "PowerPoint", users: 35 },
      { name: "Outlook", users: 25 },
      { name: "Teams", users: 15 },
    ],
  },

  {
    name: "SQL Server",
    value: 80,
    programs: [
      { name: "PG1", users: 45 },
      { name: "PG2", users: 30 },
      { name: "PG3", users: 20 },
    ],
  },

  {
    name: "Windows Server",
    value: 60,
    programs: [
      { name: "Server 1", users: 40 },
      { name: "Server 2", users: 30 },
    ],
  },
];

export const labDistribution = [
  {
    lab: "DMSRDE",
    value: 120,
    programs: [
      { name: "Excel", total: 80, consumed: 50 },
      { name: "Power BI", total: 40, consumed: 20 },
    ],
  },

  {
    lab: "DRDL",
    value: 95,
    programs: [
      { name: "Excel", total: 70, consumed: 45 },
      { name: "Power BI", total: 30, consumed: 18 },
    ],
  },

  {
    lab: "DITCS",
    value: 110,
    programs: [
      { name: "Excel", total: 60, consumed: 38 },
      { name: "Power BI", total: 50, consumed: 36 },
    ],
  },

  {
    lab: "SSPL",
    value: 85,
    programs: [
      { name: "Excel", total: 50, consumed: 32 },
      { name: "Power BI", total: 35, consumed: 24 },
    ],
  },

  {
    lab: "DELHI-HQ",
    value: 140,
    programs: [
      { name: "Excel", total: 80, consumed: 52 },
      { name: "Power BI", total: 60, consumed: 34 },
    ],
  },
];

export const labSummaryData = {
  DMSRDE: {
    totalAssigned: 20,
    used: 14,
  },

  DRDL: {
    totalAssigned: 35,
    used: 26,
  },

  DITCS: {
    totalAssigned: 28,
    used: 20,
  },

  SSDL: {
    totalAssigned: 24,
    used: 16,
  },

  "DELHI-HQ": {
    totalAssigned: 30,
    used: 23,
  },
};