package com.example.demo.repository;

import com.example.demo.model.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Long> {
    List<Conductor> findByEstado(String estado);
}
