package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.math.BigInteger;

@Data
@Builder
public class DailyPayCalculation {
    private BigDecimal hoursWorked;
    private BigInteger grossPay;
    private BigInteger foodAllowance;
    private BigInteger overtimePay;
    private BigInteger holidayPay;
    private BigInteger lateDeduction;
    private BigInteger netPay;
}
