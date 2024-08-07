package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;
import java.math.BigInteger;

@Data
@Builder
public class UpdateEmployeeSchema {
    private int id;
    private PayDetail payDetail;


    @Data
    @Builder
    public static class PayDetail {
        private Integer workingHours;
        private Boolean paidOffDay;
        private BigInteger payPerHour;
        private BigInteger overtimePay;
        private BigInteger foodAllowance;
    }
}
