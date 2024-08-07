package com.liquestore.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigInteger;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeRequest {
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
