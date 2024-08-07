package com.liquestore.mapper;

import com.liquestore.constants.AttendanceStatus;
import com.liquestore.dto.employee.UpdateEmployeeAttendanceSchema;
import com.liquestore.model.AbsensiModel;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

@Service
public class UpdateEmployeeAttendanceSchemaMapper {
    public UpdateEmployeeAttendanceSchema map(int employeeId, LocalDate date, AttendanceStatus attendanceStatus) {
        return UpdateEmployeeAttendanceSchema.builder()
                .employeeId(employeeId)
                .date(date.toString())
                .attendanceStatus(attendanceStatus.name())
                .build();
    }

    public UpdateEmployeeAttendanceSchema map(AbsensiModel attendance) {
        LocalDate date = LocalDate.ofInstant(Instant.ofEpochMilli(attendance.getTodaydate().getTime()), ZoneId.systemDefault());

        LocalTime clockIn = LocalTime.from(attendance.getClockin().toLocalDateTime().toLocalTime());
        LocalTime clockOut = LocalTime.from(attendance.getClockout().toLocalDateTime().toLocalTime());

        return UpdateEmployeeAttendanceSchema.builder()
                .employeeId(attendance.getEmployeeid())
                .date(date.toString())
                .clockIn(clockIn.toString())
                .clockOut(clockOut.toString())
                .attendanceStatus(AttendanceStatus.PRESENT.name())
                .build();
    }
}
