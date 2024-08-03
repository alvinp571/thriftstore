package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetEmployeeSchema {
    private int id;
    private String fullName;
    private String scheduledClockIn;
    private String offDay;
}
