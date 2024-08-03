package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
public class GetPayDetailSchema {
    private List<DailyPayDetail> dailyPayDetail;
    private BigInteger monthlyPayGross;
    private int absentCount;
    private BigInteger absentDeduction;
    private BigInteger deduction;
    private BigInteger monthlyPayNet;


    @Data
    @Builder
    public static class DailyPayDetail {
        private LocalDate date;
        private LocalTime clockIn;
        private LocalTime clockOut;
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
