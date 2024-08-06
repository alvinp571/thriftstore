package com.liquestore.mapper;

import com.liquestore.dto.employee.GetEmployeeSchema;
import com.liquestore.model.EmployeeModel;
import com.liquestore.model.EmployeePayDetail;
import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class GetEmployeeSchemaMapper {
    public static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm");

    public GetEmployeeSchema map(EmployeeModel employee, EmployeePayDetail employeePayDetail) {
        String scheduledClockIn = TIME_FORMATTER.format(
                LocalTime.ofInstant(Instant.ofEpochMilli(employee.getJam_masuk().getTime()), ZoneId.systemDefault()));
        String offDay = DayOfWeek.of(employee.getOffDay()).name();

        GetEmployeeSchema.PayDetail payDetail = mapPayDetail(employeePayDetail);

        return GetEmployeeSchema.builder()
                .id(employee.getId())
                .fullName(employee.getFullname())
                .scheduledClockIn(scheduledClockIn)
                .offDay(offDay)
                .payDetail(payDetail)
                .build();
    }

    public GetEmployeeSchema.PayDetail mapPayDetail(EmployeePayDetail employeePayDetail) {
        return GetEmployeeSchema.PayDetail.builder()
                .workingHours(employeePayDetail.getWorkingHours())
                .payPerHour(employeePayDetail.getPayPerHour())
                .paidOffDay(employeePayDetail.getPaidOffDay())
                .overtimePay(employeePayDetail.getOvertimePay())
                .foodAllowance(employeePayDetail.getFoodAllowance())
                .build();
    }
}
