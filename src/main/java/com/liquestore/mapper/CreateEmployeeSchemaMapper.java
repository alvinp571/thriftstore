package com.liquestore.mapper;

import com.liquestore.dto.employee.CreateEmployeeSchema;
import com.liquestore.model.EmployeeModel;
import org.springframework.stereotype.Service;

@Service
public class CreateEmployeeSchemaMapper {
    public CreateEmployeeSchema map(EmployeeModel employee) {
        return CreateEmployeeSchema.builder()
                .userName(employee.getUsername())
                .fullName(employee.getFullname())
                .email(employee.getEmail())
                .birthDate(employee.getBirthdate().toString())
                .phoneNumber(employee.getPhonenumber())
                .build();
    }
}
