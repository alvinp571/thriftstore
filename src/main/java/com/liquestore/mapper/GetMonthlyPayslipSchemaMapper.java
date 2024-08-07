package com.liquestore.mapper;

import com.liquestore.constants.AttendanceStatus;
import com.liquestore.dto.employee.DailyPayCalculation;
import com.liquestore.dto.employee.GetMonthlyPayslipSchema;
import com.liquestore.dto.employee.MonthlyPayCalculation;
import com.liquestore.model.AbsensiModel;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class GetMonthlyPayslipSchemaMapper {
    public static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    public static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm");

    public GetMonthlyPayslipSchema map(List<GetMonthlyPayslipSchema.DailyPayslip> dailyPayslipList,
            MonthlyPayCalculation monthlyPayCalculation) {
        return GetMonthlyPayslipSchema.builder()
                .dailyPayslipList(dailyPayslipList)
                .monthlyPayGross(monthlyPayCalculation.getGrossPay())
                .absentCount(monthlyPayCalculation.getAbsentCount())
                .absentDeduction(monthlyPayCalculation.getAbsentDeduction())
                .monthlyPayNet(monthlyPayCalculation.getNetPay())
                .build();
    }

    public GetMonthlyPayslipSchema.DailyPayslip mapDailyPayDetail(AbsensiModel attendance,
            DailyPayCalculation dailyPayCalculation, AttendanceStatus attendanceStatus) {
        String date = DATE_FORMAT.format(
                LocalDate.ofInstant(attendance.getTodaydate().toInstant(), ZoneId.systemDefault()));
        String clockIn = TIME_FORMAT.format(attendance.getClockin().toLocalDateTime().toLocalTime());
        String clockOut = TIME_FORMAT.format(attendance.getClockout().toLocalDateTime().toLocalTime());

        return GetMonthlyPayslipSchema.DailyPayslip.builder()
                .date(date)
                .clockIn(clockIn)
                .clockOut(clockOut)
                .hoursWorked(dailyPayCalculation.getHoursWorked())
                .basePay(dailyPayCalculation.getGrossPay())
                .foodAllowance(dailyPayCalculation.getFoodAllowance())
                .overtimePay(dailyPayCalculation.getOvertimePay())
                .holidayPay(dailyPayCalculation.getHolidayPay())
                .lateDeduction(dailyPayCalculation.getLateDeduction())
                .attendanceStatus(attendanceStatus.name())
                .netPay(dailyPayCalculation.getNetPay())
                .build();
    }

    public GetMonthlyPayslipSchema.DailyPayslip mapDailyPayDetail(LocalDate date, AttendanceStatus attendanceStatus) {
        return GetMonthlyPayslipSchema.DailyPayslip.builder()
                .date(DATE_FORMAT.format(date))
                .attendanceStatus(attendanceStatus.name())
                .build();
    }
}
