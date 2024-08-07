package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateEmployeeSchema {
    private String userName;
    private String fullName;
    private String email;
    private String birthDate;
    private String phoneNumber;
}
