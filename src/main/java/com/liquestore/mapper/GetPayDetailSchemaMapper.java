package com.liquestore.mapper;

import com.liquestore.constants.AttendanceStatus;
import com.liquestore.dto.employee.DailyPayCalculation;
import com.liquestore.dto.employee.GetPayDetailSchema;
import com.liquestore.dto.employee.MonthlyPayCalculation;
import com.liquestore.model.AbsensiModel;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class GetPayDetailSchemaMapper {
    public static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    public static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm");

    public GetPayDetailSchema map(List<GetPayDetailSchema.DailyPayDetail> dailyPayDetailList,
            MonthlyPayCalculation monthlyPayCalculation) {
        return GetPayDetailSchema.builder()
                .dailyPayDetail(dailyPayDetailList)
                .monthlyPayGross(monthlyPayCalculation.getGrossPay())
                .absentCount(monthlyPayCalculation.getAbsentCount())
                .absentDeduction(monthlyPayCalculation.getAbsentDeduction())
                .monthlyPayNet(monthlyPayCalculation.getNetPay())
                .build();
    }

    public GetPayDetailSchema.DailyPayDetail mapDailyPayDetail(AbsensiModel attendance,
            DailyPayCalculation dailyPayCalculation, AttendanceStatus attendanceStatus) {
        String date = DATE_FORMAT.format(
                LocalDate.ofInstant(attendance.getTodaydate().toInstant(), ZoneId.systemDefault()));
        String clockIn = TIME_FORMAT.format(attendance.getClockin().toLocalDateTime().toLocalTime());
        String clockOut = TIME_FORMAT.format(attendance.getClockout().toLocalDateTime().toLocalTime());

        return GetPayDetailSchema.DailyPayDetail.builder()
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

    public GetPayDetailSchema.DailyPayDetail mapDailyPayDetail(LocalDate date, AttendanceStatus attendanceStatus) {
        return GetPayDetailSchema.DailyPayDetail.builder()
                .date(DATE_FORMAT.format(date))
                .attendanceStatus(attendanceStatus.name())
                .build();
    }
}
