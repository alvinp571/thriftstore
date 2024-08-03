package com.liquestore.controller;

import com.liquestore.dto.employee.GetEmployeeListSchema;
import com.liquestore.dto.employee.GetPayDetailSchema;
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

    @GetMapping("/{id}/pay-detail")
    public ResponseEntity<GetPayDetailSchema> getPayDetail(
            @PathVariable("id") int employeeId,
            @RequestParam("month") int month,
            @RequestParam("year") int year) {
        GetPayDetailSchema outputSchema = employeeService.getPayDetail(employeeId, month, year);

        return ResponseEntity.ok(outputSchema);
    }
}
