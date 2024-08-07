package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;
import java.math.BigInteger;
import java.util.List;

@Data
@Builder
public class GetEmployeeListSchema {
    private List<Employee> employeeList;


    @Data
    @Builder
    public static class Employee {
        private int id;
        private String fullName;
        private String role;
        private String phoneNumber;
        private String email;
        private PayDetail payDetail;
    }


    @Data
    @Builder
    public static class PayDetail {
        private int workingHours;
        private int paidOffDay;
        private BigInteger payPerHour;
        private BigInteger overtimePay;
        private BigInteger foodAllowance;
    }
}
