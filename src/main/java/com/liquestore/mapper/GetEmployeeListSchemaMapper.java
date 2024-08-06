package com.liquestore.mapper;

import com.liquestore.dto.employee.GetEmployeeListSchema;
import com.liquestore.model.EmployeeModel;
import com.liquestore.model.EmployeePayDetail;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GetEmployeeListSchemaMapper {
    public GetEmployeeListSchema map(List<EmployeeModel> employeeModelList) {
        List<GetEmployeeListSchema.Employee> employeeList = employeeModelList.stream()
                .map(this::mapEmployee)
                .toList();

        return GetEmployeeListSchema.builder()
                .employeeList(employeeList)
                .build();
    }

    public GetEmployeeListSchema.Employee mapEmployee(EmployeeModel employeeModel) {
        return GetEmployeeListSchema.Employee.builder()
                .id(employeeModel.getId())
                .fullName(employeeModel.getFullname())
                .role(employeeModel.getAccessRight().getPosition())
                .email(employeeModel.getEmail())
                .build();
    }

    public GetEmployeeListSchema.Employee mapEmployee(EmployeeModel employeeModel,
            EmployeePayDetail employeePayDetail) {
        GetEmployeeListSchema.PayDetail payDetail = mapEmployeePayDetail(employeePayDetail);

        return GetEmployeeListSchema.Employee.builder()
                .id(employeeModel.getId())
                .fullName(employeeModel.getFullname())
                .role(employeeModel.getAccessRight().getPosition())
                .email(employeeModel.getEmail())
                .payDetail(payDetail)
                .build();
    }

    public GetEmployeeListSchema.PayDetail mapEmployeePayDetail(EmployeePayDetail employeePayDetail) {
        return GetEmployeeListSchema.PayDetail.builder()
                .workingHours(employeePayDetail.getWorkingHours())
                .payPerHour(employeePayDetail.getPayPerHour())
                .paidOffDay(employeePayDetail.getPaidOffDay())
                .overtimePay(employeePayDetail.getOvertimePay())
                .foodAllowance(employeePayDetail.getFoodAllowance())
                .build();
    }
}
