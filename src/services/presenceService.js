const API_URL = "http://localhost:3000/api";

export const presenceService = {
  async getTodayPresence() {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `${API_URL}/presence?startDate=${today}&endDate=${today}`
    );
    if (!response.ok) throw new Error("Failed to fetch today's presence");
    return response.json();
  },

  async checkIn(employeeId) {
    const now = new Date();
    const time = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const response = await fetch(`${API_URL}/presence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee: employeeId,
        date: now.toISOString().split("T")[0],
        status: "present",
        checkInTime: time,
      }),
    });

    if (!response.ok) throw new Error("Failed to check in");
    return response.json();
  },

  async checkOut(presenceRecord) {
    const time = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Extract only the needed fields for the update
    const updateData = {
      employee: presenceRecord.employee.id || presenceRecord.employee._id,
      date: presenceRecord.date,
      status: presenceRecord.status,
      checkInTime: presenceRecord.checkInTime,
      checkOutTime: time,
    };

    const response = await fetch(
      `${API_URL}/presence/${presenceRecord.id || presenceRecord._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) throw new Error("Failed to check out");
    return response.json();
  },

  async getEmployeePresence(employeeId, startDate, endDate) {
    const response = await fetch(
      `${API_URL}/presence/employee/${employeeId}?startDate=${startDate}&endDate=${endDate}`
    );
    if (!response.ok) throw new Error("Failed to fetch employee presence");
    return response.json();
  },

  async markDayOff(employeeId, date) {
    const response = await fetch(`${API_URL}/presence/day-off`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId,
        date,
      }),
    });

    if (!response.ok) throw new Error("Failed to mark day off");
    return response.json();
  },

  async markAsAbsent(employeeId, date) {
    const response = await fetch(`${API_URL}/presence/absent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId,
        date,
      }),
    });

    if (!response.ok) throw new Error("Failed to mark as absent");
    return response.json();
  },

  async createInitialPresence(employeeId, date) {
    const response = await fetch(`${API_URL}/presence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee: employeeId,
        date: date,
        status: "absent",
        checkInTime: "00:00",
      }),
    });

    if (!response.ok)
      throw new Error("Failed to create initial presence record");
    return response.json();
  },

  async confirmAbsence(presenceId) {
    const response = await fetch(`${API_URL}/presence/${presenceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "absent",
        checkInTime: "00:00",
        checkOutTime: "00:00",
      }),
    });

    if (!response.ok) throw new Error("Failed to confirm absence");
    return response.json();
  },

  async updatePresenceStatus(presenceId, newStatus) {
    const response = await fetch(`${API_URL}/presence/${presenceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    if (!response.ok) throw new Error("Failed to update presence status");
    return response.json();
  },

  async updatePresence(presenceId, updateData) {
    // Remove MongoDB system fields if they exist
    const { _id, createdAt, updatedAt, __v, ...cleanData } = updateData;

    const response = await fetch(`${API_URL}/presence/${presenceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanData),
    });

    if (!response.ok) throw new Error("Failed to update presence record");
    return response.json();
  },
};
