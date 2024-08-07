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
        private BigInteger payPerHour;
        private int paidOffDay;
        private int overtimePay;
        private int foodAllowance;
    }
}
