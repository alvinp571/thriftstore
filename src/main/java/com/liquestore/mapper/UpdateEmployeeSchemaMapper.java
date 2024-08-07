package com.liquestore.mapper;

import com.liquestore.dto.employee.UpdateEmployeeSchema;
import com.liquestore.model.EmployeePayDetail;
import org.springframework.stereotype.Service;

@Service
public class UpdateEmployeeSchemaMapper {
    public UpdateEmployeeSchema map(int employeeId, EmployeePayDetail employeePayDetail) {
        UpdateEmployeeSchema.PayDetail payDetail = mapPayDetail(employeePayDetail);

        return UpdateEmployeeSchema.builder()
                .id(employeeId)
                .payDetail(payDetail)
                .build();
    }

    public UpdateEmployeeSchema.PayDetail mapPayDetail(EmployeePayDetail employeePayDetail) {
        return UpdateEmployeeSchema.PayDetail.builder()
                .workingHours(employeePayDetail.getWorkingHours())
                .payPerHour(employeePayDetail.getPayPerHour())
                .paidOffDay(employeePayDetail.getPaidOffDay() == 1)
                .overtimePay(employeePayDetail.getOvertimePay())
                .foodAllowance(employeePayDetail.getFoodAllowance())
                .build();
    }
}
