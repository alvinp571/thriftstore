package com.liquestore.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.math.BigInteger;

@Data
@Entity
@Table(name = "employee_pay_detail")
public class EmployeePayDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int employeeId;
    private int workingHours;
    private BigInteger payPerHour;
    private int paidOffDay;
    private int overtimePay;
    private int foodAllowance;
}
