package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateEmployeeAttendanceSchema {
    private int employeeId;
    private String date;
    private String clockIn;
    private String clockOut;
    private String attendanceStatus;
}
