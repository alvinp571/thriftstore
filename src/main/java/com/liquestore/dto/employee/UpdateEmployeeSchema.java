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
        private BigInteger payPerHour;
        private Boolean paidOffDay;
        private Integer overtimePay;
        private Integer foodAllowance;
    }
}
