package com.liquestore.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import java.math.BigInteger;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "employee")
public class EmployeeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String fullname;
    private String email;
    private Date birthdate;
    private String password;
    private String phonenumber;
    private String status;
    private Timestamp firstjoindate;
    private Timestamp lastupdate;

    @DateTimeFormat(pattern = "HH:mm")
    private Time jam_masuk;

    private String jadwal_libur;

    private int offDay;
    private int workingHours;
    private BigInteger payPerHour;
    private int holidayPay;
    private BigInteger overtimePay;
    private BigInteger foodAllowance;

    @ManyToOne
    @JoinColumn(name = "accessrightid", referencedColumnName = "id")
    private AccessRightModel accessRight;

    public EmployeeModel() {
    }

    public EmployeeModel(int id) {
        this.id = id;
    }
}
