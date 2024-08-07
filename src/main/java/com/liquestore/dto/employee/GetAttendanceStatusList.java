package com.liquestore.dto.employee;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class GetAttendanceStatusList {
    private List<String> attendanceStatusList;
}
