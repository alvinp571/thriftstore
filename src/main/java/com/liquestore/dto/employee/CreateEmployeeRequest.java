package com.liquestore.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEmployeeRequest {
    private String userName;
    private String fullName;
    private String email;
    private String password;
    private String birthDate; // Expected format yyyy-MM-dd
    private String phoneNumber;
    private Integer accessRightId;
}
