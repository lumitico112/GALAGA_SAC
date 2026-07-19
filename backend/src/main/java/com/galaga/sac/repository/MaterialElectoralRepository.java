package com.galaga.sac.repository;

import com.galaga.sac.model.MaterialElectoral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaterialElectoralRepository extends JpaRepository<MaterialElectoral, Long> {
    List<MaterialElectoral> findByRutaIdRuta(Long idRuta);
}
