package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class GetEmployeeListSchema {
    private List<Employee> employeeList;


    @Data
    @Builder
    public static class Employee {
        private int id;
        private String fullName;
    }
}
