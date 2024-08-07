package com.liquestore.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum AttendanceStatus {
    PRESENT("HADIR"),
    ABSENT("ABSEN"),
    LATE("TELAT"),
    OFF("LIBUR"),
    UNDER_WORK_HOURS("DIBAWAH JAM KERJA");

    private final String labelId;

    public static AttendanceStatus valueOfLabelId(String labelId) {
        return Arrays.stream(AttendanceStatus.values())
                .filter(a -> a.getLabelId().equals(labelId))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
