package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;
import java.math.BigInteger;

@Data
@Builder
public class GetEmployeeSchema {
    private int id;
    private String fullName;
    private String scheduledClockIn;
    private String offDay;
    private String phoneNumber;
    private PayDetail payDetail;


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
