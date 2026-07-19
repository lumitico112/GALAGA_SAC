package com.galaga.sac.repository;

import com.galaga.sac.model.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RutaRepository extends JpaRepository<Ruta, Long> {
    List<Ruta> findByEstado(String estado);
    List<Ruta> findByConductorIdConductor(Long idConductor);
}
