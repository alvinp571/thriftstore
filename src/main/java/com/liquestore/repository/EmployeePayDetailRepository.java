package com.liquestore.repository;

import com.liquestore.model.EmployeePayDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmployeePayDetailRepository extends JpaRepository<EmployeePayDetail, Integer> {
    public Optional<EmployeePayDetail> findByEmployeeId(int employeeId);
}
