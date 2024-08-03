package com.liquestore.service;

import com.liquestore.constants.AttendanceStatus;
import com.liquestore.dto.employee.DailyPayCalculation;
import com.liquestore.dto.employee.GetPayDetailSchema;
import com.liquestore.dto.employee.MonthlyPayCalculation;
import com.liquestore.mapper.GetPayDetailResponseMapper;
import com.liquestore.model.AbsensiModel;
import com.liquestore.model.EmployeeModel;
import com.liquestore.repository.AbsensiRepository;
import com.liquestore.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final AbsensiRepository absensiRepository;

    private final GetPayDetailResponseMapper getPayDetailResponseMapper;

    public GetPayDetailSchema getPayDetail(int employeeId, int month, int year) {
        EmployeeModel employee = employeeRepository.findById(employeeId)
                .orElseThrow(RuntimeException::new);
        var attendanceList = absensiRepository.findByEmployeeidOrderByTodaydateAsc(employeeId);
        var dailyPayDetailList = buildDailyPayDetailList(employee, month, year, attendanceList);
        var monthlyPayCalculation = calculateMonthlyPay(dailyPayDetailList);

        return getPayDetailResponseMapper.map(dailyPayDetailList, monthlyPayCalculation);
    }

    private List<GetPayDetailSchema.DailyPayDetail> buildDailyPayDetailList(EmployeeModel employee, int month, int year,
            List<AbsensiModel> attendanceList) {
        List<GetPayDetailSchema.DailyPayDetail> dailyPayDetailList = new ArrayList<>();

        YearMonth yearMonth = YearMonth.of(year, month);
        int lengthOfMonth = yearMonth.lengthOfMonth();

        int day = 1;
        int index = 0;

        while (day <= lengthOfMonth && index < attendanceList.size()) {
            LocalDate date = LocalDate.of(year, month, day);

            AbsensiModel attendance = attendanceList.get(index);
            int attendanceDay = LocalDate.ofInstant(attendance.getTodaydate().toInstant(), ZoneId.systemDefault())
                    .getDayOfMonth();

            if (day == attendanceDay) {
                DailyPayCalculation dailyPayCalculation = calculateDailyPay(employee, attendance);
                var dailyPayDetail = getPayDetailResponseMapper.mapDailyPayDetail(attendance, dailyPayCalculation,
                        AttendanceStatus.PRESENT);
                dailyPayDetailList.add(dailyPayDetail);

                index++;
            }
            else {
                dailyPayDetailList.add(getPayDetailResponseMapper.mapDailyPayDetail(date, AttendanceStatus.ABSENT));
            }

            day++;
        }

        while (day <= lengthOfMonth) {
            LocalDate date = LocalDate.of(year, month, day);
            dailyPayDetailList.add(getPayDetailResponseMapper.mapDailyPayDetail(date, AttendanceStatus.ABSENT));

            day++;
        }

        return dailyPayDetailList;
    }

    private DailyPayCalculation calculateDailyPay(EmployeeModel employee, AbsensiModel attendance) {
        LocalDate date = LocalDate.ofInstant(attendance.getTodaydate().toInstant(), ZoneId.systemDefault());
        int dayOfWeek = date.getDayOfWeek().getValue();

        LocalTime clockIn = attendance.getClockin().toLocalDateTime().toLocalTime();
        LocalTime clockOut = attendance.getClockin().toLocalDateTime().toLocalTime();
        BigDecimal hoursWorked = BigDecimal.valueOf(clockOut.toSecondOfDay())
                .min(BigDecimal.valueOf(clockIn.toSecondOfDay()))
                .divide(BigDecimal.valueOf(3600), RoundingMode.HALF_UP);
        BigDecimal workHours = new BigDecimal(employee.getWorkingHours());
        BigDecimal overtimeHours = (hoursWorked.compareTo(workHours) > 0)
                ? hoursWorked.min(workHours)
                : BigDecimal.ZERO;

        BigInteger grossPay = new BigDecimal(employee.getPayPerHour())
                .multiply(workHours)
                .toBigInteger();
        BigInteger overtimePay = new BigDecimal(employee.getOvertimePay())
                .multiply(overtimeHours)
                .toBigInteger();
        BigInteger holidayPay = (dayOfWeek == employee.getOffDay() && employee.getHolidayPay() == 1)
                ? grossPay
                : BigInteger.ZERO;
        BigInteger lateDeduction = BigInteger.ZERO;
        BigInteger netPay = grossPay
                .add(overtimePay)
                .add(holidayPay)
                .subtract(lateDeduction);

        return DailyPayCalculation.builder()
                .hoursWorked(hoursWorked)
                .grossPay(grossPay)
                .foodAllowance(employee.getFoodAllowance())
                .overtimePay(overtimePay)
                .holidayPay(holidayPay)
                .lateDeduction(lateDeduction)
                .netPay(netPay)
                .build();
    }

    private MonthlyPayCalculation calculateMonthlyPay(List<GetPayDetailSchema.DailyPayDetail> dailyPayDetailList) {
        BigInteger grossPay = dailyPayDetailList.stream()
                .map(GetPayDetailSchema.DailyPayDetail::getNetPay)
                .reduce(BigInteger.ZERO, (a, b) -> a.add(Optional.ofNullable(b).orElse(BigInteger.ZERO)));

        int absentCount = (int) dailyPayDetailList.stream()
                .filter(pd -> AttendanceStatus.ABSENT
                        .equals(AttendanceStatus.valueOf(pd.getAttendanceStatus())))
                .count();
        BigDecimal absentModifier = BigDecimal.valueOf(absentCount)
                .multiply(BigDecimal.valueOf(0.04));
        BigInteger absentDeduction = new BigDecimal(grossPay)
                .multiply(absentModifier)
                .toBigInteger();

        BigInteger netPay = grossPay.subtract(absentDeduction);

        return MonthlyPayCalculation.builder()
                .grossPay(grossPay)
                .absentCount(absentCount)
                .absentDeduction(absentDeduction)
                .netPay(netPay)
                .build();
    }
}
