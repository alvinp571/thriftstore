package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

@Data
@Builder
public class GetMonthlyPayslipSchema {
    private List<DailyPayslip> dailyPayslipList;
    private BigInteger monthlyPayGross;
    private int absentCount;
    private BigInteger absentDeduction;
    private int lateCount;
    private BigInteger lateDeduction;
    private BigInteger netDeduction;
    private BigInteger monthlyPayNet;


    @Data
    @Builder
    public static class DailyPayslip {
        private String date;
        private String clockIn;
        private String clockOut;
        private BigDecimal hoursWorked;
        private BigInteger basePay;
        private BigInteger foodAllowance;
        private BigInteger overtimePay;
        private BigInteger holidayPay;
        private BigInteger lateDeduction;
        private String attendanceStatus;
        private BigInteger netPay;
    }
}
