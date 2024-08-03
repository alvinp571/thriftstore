package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;
import java.math.BigInteger;

@Data
@Builder
public class MonthlyPayCalculation {
    private BigInteger grossPay;
    private int absentCount;
    private BigInteger absentDeduction;
    private BigInteger deduction;
    private BigInteger netPay;
}
