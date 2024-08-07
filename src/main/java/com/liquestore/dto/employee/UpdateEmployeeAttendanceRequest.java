package com.liquestore.dto.employee;

import lombok.Data;

@Data
public class UpdateEmployeeAttendanceRequest {
    private String date;
    private String clockIn;
    private String clockOut;
    private String attendanceStatus;
}
