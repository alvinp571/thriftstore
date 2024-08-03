package com.liquestore.mapper;

import com.liquestore.constants.AttendanceStatus;
import com.liquestore.dto.employee.DailyPayCalculation;
import com.liquestore.dto.employee.GetPayDetailSchema;
import com.liquestore.dto.employee.MonthlyPayCalculation;
import com.liquestore.model.AbsensiModel;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class GetPayDetailSchemaMapper {
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
        return GetPayDetailSchema.DailyPayDetail.builder()
                .date(LocalDate.ofInstant(attendance.getTodaydate().toInstant(), ZoneId.systemDefault()))
                .clockIn(attendance.getClockin().toLocalDateTime().toLocalTime())
                .clockOut(attendance.getClockout().toLocalDateTime().toLocalTime())
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
                .date(date)
                .attendanceStatus(attendanceStatus.name())
                .build();
    }
}
