package com.liquestore.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.sql.Timestamp;
import java.util.Date;

@Data
@Entity
@Table(name = "absensi")
public class AbsensiModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int employeeid;
    private String username;
    private String password;
    private Timestamp clockin;
    private Timestamp clockout;
    private Date todaydate;

    public AbsensiModel() {
    }
}
