package com.liquestore.controller;

import com.liquestore.dto.employee.CreateEmployeeRequest;
import com.liquestore.dto.employee.CreateEmployeeSchema;
import com.liquestore.dto.employee.GetAttendanceStatusList;
import com.liquestore.dto.employee.GetEmployeeListSchema;
import com.liquestore.dto.employee.GetEmployeeSchema;
import com.liquestore.dto.employee.GetMonthlyPayslipSchema;
import com.liquestore.dto.employee.UpdateEmployeeAttendanceRequest;
import com.liquestore.dto.employee.UpdateEmployeeAttendanceSchema;
import com.liquestore.dto.employee.UpdateEmployeeRequest;
import com.liquestore.dto.employee.UpdateEmployeeSchema;
import com.liquestore.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<CreateEmployeeSchema> createEmployee(@RequestBody CreateEmployeeRequest requestBody) {
        CreateEmployeeSchema outputSchema = employeeService.createEmployee(requestBody);

        return ResponseEntity.ok(outputSchema);
    }

    @GetMapping
    public ResponseEntity<GetEmployeeListSchema> getEmployeeList() {
        GetEmployeeListSchema outputSchema = employeeService.getEmployeeList();

        return ResponseEntity.ok(outputSchema);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetEmployeeSchema> getEmployee(@PathVariable int id) {
        GetEmployeeSchema outputSchema = employeeService.getEmployee(id);

        return ResponseEntity.ok(outputSchema);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpdateEmployeeSchema> updateEmployee(@PathVariable int id,
            @RequestBody UpdateEmployeeRequest requestBody) {
        UpdateEmployeeSchema outputSchema = employeeService.updateEmployee(id, requestBody);

        return ResponseEntity.ok(outputSchema);
    }

    @GetMapping("/{id}/monthly-payslip")
    public ResponseEntity<GetMonthlyPayslipSchema> getMonthlyPayslip(
            @PathVariable("id") int employeeId,
            @RequestParam("month") int month,
            @RequestParam("year") int year) {
        GetMonthlyPayslipSchema outputSchema = employeeService.getPayslip(employeeId, month, year);

        return ResponseEntity.ok(outputSchema);
    }

    @PutMapping("/{id}/attendance")
    public ResponseEntity<UpdateEmployeeAttendanceSchema> updateAttendance(
            @PathVariable("id") int employeeId,
            @RequestBody UpdateEmployeeAttendanceRequest requestBody) {
        UpdateEmployeeAttendanceSchema outputSchema = employeeService.updateEmployeeAttendance(employeeId, requestBody);

        return ResponseEntity.ok(outputSchema);
    }

    @GetMapping("/attendance-status")
    public ResponseEntity<GetAttendanceStatusList> getAttendanceStatusList() {
        GetAttendanceStatusList outputSchema = employeeService.getAttendanceStatusList();

        return ResponseEntity.ok(outputSchema);
    }
}
