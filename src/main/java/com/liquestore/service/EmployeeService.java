package com.liquestore.service;

import com.liquestore.constants.AttendanceStatus;
import com.liquestore.dto.employee.CreateEmployeeRequest;
import com.liquestore.dto.employee.CreateEmployeeSchema;
import com.liquestore.dto.employee.DailyPayCalculation;
import com.liquestore.dto.employee.GetEmployeeListSchema;
import com.liquestore.dto.employee.GetEmployeeSchema;
import com.liquestore.dto.employee.GetMonthlyPayslipSchema;
import com.liquestore.dto.employee.MonthlyPayCalculation;
import com.liquestore.dto.employee.UpdateEmployeeRequest;
import com.liquestore.dto.employee.UpdateEmployeeSchema;
import com.liquestore.mapper.CreateEmployeeSchemaMapper;
import com.liquestore.mapper.GetEmployeeListSchemaMapper;
import com.liquestore.mapper.GetEmployeeSchemaMapper;
import com.liquestore.mapper.GetMonthlyPayslipSchemaMapper;
import com.liquestore.mapper.UpdateEmployeeSchemaMapper;
import com.liquestore.model.AbsensiModel;
import com.liquestore.model.AccessRightModel;
import com.liquestore.model.EmployeeModel;
import com.liquestore.model.EmployeePayDetail;
import com.liquestore.repository.AbsensiRepository;
import com.liquestore.repository.EmployeePayDetailRepository;
import com.liquestore.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
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
    private final EmployeePayDetailRepository employeePayDetailRepository;
    private final AbsensiRepository absensiRepository;

    private final PasswordEncoder passwordEncoder;

    private final CreateEmployeeSchemaMapper createEmployeeSchemaMapper;
    private final GetEmployeeListSchemaMapper getEmployeeListSchemaMapper;
    private final GetEmployeeSchemaMapper getEmployeeSchemaMapper;
    private final GetMonthlyPayslipSchemaMapper getMonthlyPayslipResponseMapper;
    private final UpdateEmployeeSchemaMapper updateEmployeeSchemaMapper;

    public CreateEmployeeSchema createEmployee(CreateEmployeeRequest newEmployee) {
        LocalDate birthDate = LocalDate.parse(newEmployee.getBirthDate());
        String encodedPassword = passwordEncoder.encode(newEmployee.getPassword());
        Timestamp createdTimestamp = Timestamp.from(Instant.now());

        EmployeeModel employee = EmployeeModel.builder()
                .username(newEmployee.getUserName())
                .fullname(newEmployee.getFullName())
                .email(newEmployee.getEmail())
                .birthdate(Date.valueOf(birthDate))
                .password(encodedPassword)
                .phonenumber(newEmployee.getPhoneNumber())
                .firstjoindate(createdTimestamp)
                .lastupdate(createdTimestamp)
                .accessRight(AccessRightModel.builder()
                        .id(newEmployee.getAccessRightId())
                        .build())
                .build();
        EmployeeModel createdEmployee = employeeRepository.save(employee);

        EmployeePayDetail employeePayDetail = EmployeePayDetail.builder()
                .employeeId(createdEmployee.getId())
                .build();
        employeePayDetailRepository.save(employeePayDetail);

        return createEmployeeSchemaMapper.map(employee);
    }

    public GetEmployeeListSchema getEmployeeList() {
        List<GetEmployeeListSchema.Employee> employeeList = employeeRepository.findAll(Sort.by("fullname")).stream()
                .map(e -> {
                    EmployeePayDetail employeePayDetail = employeePayDetailRepository.findByEmployeeId(e.getId())
                            .orElseThrow(RuntimeException::new);

                    return getEmployeeListSchemaMapper.mapEmployee(e, employeePayDetail);
                })
                .toList();

        return GetEmployeeListSchema.builder()
                .employeeList(employeeList)
                .build();
    }

    public GetEmployeeSchema getEmployee(int id) {
        EmployeeModel employee = employeeRepository.findById(id)
                .orElseThrow(RuntimeException::new);
        EmployeePayDetail employeePayDetail = employeePayDetailRepository.findByEmployeeId(id)
                .orElse(null);

        return getEmployeeSchemaMapper.map(employee, employeePayDetail);
    }

    public GetMonthlyPayslipSchema getPayslip(int employeeId, int month, int year) {
        EmployeeModel employee = employeeRepository.findById(employeeId)
                .orElseThrow(RuntimeException::new);

        EmployeePayDetail employeePayDetail = employeePayDetailRepository.findByEmployeeId(employeeId)
                .orElseThrow(RuntimeException::new);

        Date startDate = Date.valueOf(LocalDate.of(year, month, 1));
        Date endDate = Date.valueOf(LocalDate.of(year, month, YearMonth.of(year, month).lengthOfMonth()));
        var attendanceList = absensiRepository.findByEmployeeidAndTodaydateBetweenOrderByTodaydateAsc(employeeId,
                startDate, endDate);

        var dailyPayslip = buildDailyPayslipList(employee, employeePayDetail, month, year, attendanceList);
        var monthlyPayCalculation = calculateMonthlyPay(dailyPayslip);

        return getMonthlyPayslipResponseMapper.map(dailyPayslip, monthlyPayCalculation);
    }

    public UpdateEmployeeSchema updateEmployee(int id, UpdateEmployeeRequest updateEmployeeRequest) {
        EmployeePayDetail updatedPayDetail = updatePayDetail(id, updateEmployeeRequest.getPayDetail());

        return updateEmployeeSchemaMapper.map(id, updatedPayDetail);
    }

    private List<GetMonthlyPayslipSchema.DailyPayslip> buildDailyPayslipList(EmployeeModel employee,
            EmployeePayDetail employeePayDetail, int month, int year, List<AbsensiModel> attendanceList) {
        List<GetMonthlyPayslipSchema.DailyPayslip> dailyPayslipList = new ArrayList<>();

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
                DailyPayCalculation dailyPayCalculation = calculateDailyPay(employee, employeePayDetail, attendance);
                var dailyPayDetail = getMonthlyPayslipResponseMapper.mapDailyPayDetail(attendance, dailyPayCalculation,
                        AttendanceStatus.PRESENT);
                dailyPayslipList.add(dailyPayDetail);

                index++;
            }
            else {
                dailyPayslipList.add(getMonthlyPayslipResponseMapper.mapDailyPayDetail(date, AttendanceStatus.ABSENT));
            }

            day++;
        }

        while (day <= lengthOfMonth) {
            LocalDate date = LocalDate.of(year, month, day);
            dailyPayslipList.add(getMonthlyPayslipResponseMapper.mapDailyPayDetail(date, AttendanceStatus.ABSENT));

            day++;
        }

        return dailyPayslipList;
    }

    private DailyPayCalculation calculateDailyPay(EmployeeModel employee, EmployeePayDetail employeePayDetail,
            AbsensiModel attendance) {
        LocalDate date = LocalDate.ofInstant(attendance.getTodaydate().toInstant(), ZoneId.systemDefault());
        int dayOfWeek = date.getDayOfWeek().getValue();

        LocalTime clockIn = attendance.getClockin().toLocalDateTime().toLocalTime();
        LocalTime clockOut = attendance.getClockin().toLocalDateTime().toLocalTime();
        BigDecimal hoursWorked = BigDecimal.valueOf(clockOut.toSecondOfDay())
                .min(BigDecimal.valueOf(clockIn.toSecondOfDay()))
                .divide(BigDecimal.valueOf(3600), RoundingMode.HALF_UP);
        BigDecimal workHours = new BigDecimal(employeePayDetail.getWorkingHours());
        BigDecimal overtimeHours = (hoursWorked.compareTo(workHours) > 0)
                ? hoursWorked.min(workHours)
                : BigDecimal.ZERO;

        BigInteger grossPay = new BigDecimal(employeePayDetail.getPayPerHour())
                .multiply(workHours)
                .toBigInteger();
        BigInteger overtimePay = new BigDecimal(employeePayDetail.getOvertimePay())
                .multiply(overtimeHours)
                .toBigInteger();
        BigInteger holidayPay = (dayOfWeek == employee.getOffDay() && employeePayDetail.getPaidOffDay() == 1)
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
                .foodAllowance(employeePayDetail.getFoodAllowance())
                .overtimePay(overtimePay)
                .holidayPay(holidayPay)
                .lateDeduction(lateDeduction)
                .netPay(netPay)
                .build();
    }

    private MonthlyPayCalculation calculateMonthlyPay(List<GetMonthlyPayslipSchema.DailyPayslip> dailyPayslipList) {
        BigInteger grossPay = dailyPayslipList.stream()
                .map(GetMonthlyPayslipSchema.DailyPayslip::getNetPay)
                .reduce(BigInteger.ZERO, (a, b) -> a.add(Optional.ofNullable(b).orElse(BigInteger.ZERO)));

        int absentCount = (int) dailyPayslipList.stream()
                .filter(pd -> AttendanceStatus.ABSENT
                        .equals(AttendanceStatus.valueOf(pd.getAttendanceStatus())))
                .count();
        BigDecimal absentModifier = BigDecimal.valueOf(absentCount)
                .multiply(BigDecimal.valueOf(0.04));
        BigInteger absentDeduction = new BigDecimal(grossPay)
                .multiply(absentModifier)
                .toBigInteger();

        int lateCount = (int) dailyPayslipList.stream()
                .filter(pd -> AttendanceStatus.LATE
                        .equals(AttendanceStatus.valueOf(pd.getAttendanceStatus())))
                .count();

        BigInteger netPay = grossPay.subtract(absentDeduction);

        return MonthlyPayCalculation.builder()
                .grossPay(grossPay)
                .absentCount(absentCount)
                .absentDeduction(absentDeduction)
                .lateCount(lateCount)
                .netPay(netPay)
                .build();
    }

    private EmployeePayDetail updatePayDetail(int employeeId, UpdateEmployeeRequest.PayDetail payDetailRequest) {
        return employeePayDetailRepository.findByEmployeeId(employeeId)
                .map(employeePayDetail -> {
                    employeePayDetail.setWorkingHours(payDetailRequest.getWorkingHours());
                    employeePayDetail.setPayPerHour(payDetailRequest.getPayPerHour());
                    employeePayDetail.setPaidOffDay(Boolean.TRUE.equals(payDetailRequest.getPaidOffDay()) ? 1 : 0);
                    employeePayDetail.setOvertimePay(payDetailRequest.getOvertimePay());
                    employeePayDetail.setFoodAllowance(payDetailRequest.getFoodAllowance());

                    return employeePayDetailRepository.save(employeePayDetail);
                })
                .orElseThrow(RuntimeException::new);
    }
}
