package com.liquestore.repository;

import com.liquestore.model.AbsensiModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface AbsensiRepository extends JpaRepository<AbsensiModel, Integer> {
    List<AbsensiModel> getAbsensiByEmployeeid(int id);

    List<AbsensiModel> findByEmployeeidAndTodaydateBetweenOrderByTodaydateAsc(int employeeId, Date start, Date end);

    Optional<AbsensiModel> findByTodaydate(Date todaydate);
}
