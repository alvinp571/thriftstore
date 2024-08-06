package com.liquestore.controller;

import com.liquestore.dto.employee.GetEmployeeListSchema;
import com.liquestore.dto.employee.GetEmployeeSchema;
import com.liquestore.dto.employee.GetMonthlyPayslipSchema;
import com.liquestore.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

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

    @GetMapping("/{id}/monthly-payslip")
    public ResponseEntity<GetMonthlyPayslipSchema> getMonthlyPayslip(
            @PathVariable("id") int employeeId,
            @RequestParam("month") int month,
            @RequestParam("year") int year) {
        GetMonthlyPayslipSchema outputSchema = employeeService.getPayslip(employeeId, month, year);

        return ResponseEntity.ok(outputSchema);
    }
}
