import { employeeService } from "./employeeService";
import { presenceService } from "./presenceService";

class PresenceAutomationService {
  constructor() {
    this.checkInterval = 5 * 60 * 1000; // Check every 5 minutes
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.runAutomation();
    this.intervalId = setInterval(
      () => this.runAutomation(),
      this.checkInterval
    );
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.isRunning = false;
    }
  }

  async runAutomation() {
    await this.createDailyPresenceRecords();
    await this.checkMissedShifts();
  }

  async createDailyPresenceRecords() {
    try {
      const now = new Date();

      // Skip if it's Sunday (0 is Sunday in JavaScript)
      if (now.getDay() === 0) return;

      // Only run this once at the start of each day (between 00:00 and 00:05)
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      if (currentHour !== 0 || currentMinute > 5) return;

      const employees = await employeeService.getAllEmployees();
      const activeEmployees = employees.filter((emp) => emp.isActive);

      for (const employee of activeEmployees) {
        try {
          // Check if a presence record already exists for today
          const todayStr = now.toISOString().split("T")[0];
          const existingRecord = await presenceService.getEmployeePresence(
            employee._id,
            todayStr,
            todayStr
          );

          if (!existingRecord || existingRecord.length === 0) {
            // Create a new presence record with initial status as 'absent'
            await presenceService.createInitialPresence(employee._id, todayStr);
          }
        } catch (error) {
          console.error(
            `Failed to create presence record for employee ${employee.name}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error("Failed to create daily presence records:", error);
    }
  }

  async checkMissedShifts() {
    try {
      const now = new Date();
      const currentTime = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Skip check on Sundays
      if (now.getDay() === 0) return;

      const employees = await employeeService.getAllEmployees();
      const activeEmployees = employees.filter((emp) => emp.isActive);
      const todayStr = now.toISOString().split("T")[0];

      for (const employee of activeEmployees) {
        try {
          // Only process if current time is past shift end time
          if (this.isTimePast(currentTime, employee.shiftEnd)) {
            // Get or create today's presence record
            let todayPresence = await presenceService.getEmployeePresence(
              employee._id,
              todayStr,
              todayStr
            );

            // If no presence record exists, create one
            if (!todayPresence || todayPresence.length === 0) {
              const newRecord = await presenceService.createInitialPresence(
                employee._id,
                todayStr
              );
              todayPresence = [newRecord];
            }

            const record = todayPresence[0];

            // Mark as absent if:
            // 1. Status is 'absent' and no check-in recorded, or
            // 2. No check-in time recorded, or
            // 3. Status is not 'excused' (to preserve approved days off)
            if (
              (record.status === "absent" && !record.checkInTime) ||
              !record.checkInTime ||
              (record.status !== "excused" && !record.checkInTime)
            ) {
              console.log(`Marking ${employee.name} as absent for ${todayStr}`);
              await presenceService.confirmAbsence(record.id || record._id);
            }
          }
        } catch (error) {
          console.error(
            `Failed to check missed shift for employee ${employee.name}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error("Failed to check missed shifts:", error);
    }
  }

  isTimePast(currentTime, targetTime) {
    const [currentHour, currentMinute] = currentTime.split(":").map(Number);
    const [targetHour, targetMinute] = targetTime.split(":").map(Number);

    if (currentHour > targetHour) return true;
    if (currentHour === targetHour && currentMinute > targetMinute) return true;
    return false;
  }
}

export const presenceAutomationService = new PresenceAutomationService();
