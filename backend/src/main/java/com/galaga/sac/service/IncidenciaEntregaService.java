package com.galaga.sac.service;

import com.galaga.sac.exception.BusinessRuleException;
import com.galaga.sac.exception.ResourceNotFoundException;
import com.galaga.sac.model.Entrega;
import com.galaga.sac.model.Incidencia;
import com.galaga.sac.model.Ruta;
import com.galaga.sac.repository.EntregaRepository;
import com.galaga.sac.repository.IncidenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidenciaEntregaService {

    @Autowired
    private IncidenciaRepository incidenciaRepository;

    @Autowired
    private EntregaRepository entregaRepository;

    @Autowired
    private LogisticaService logisticaService;

    // --- Incidencias ---
    public Incidencia registrarIncidencia(Incidencia incidencia) {
        // Enlazar con la ruta correspondiente
        Ruta ruta = logisticaService.obtenerRuta(incidencia.getRuta().getIdRuta());
        incidencia.setRuta(ruta);
        
        // Si hay una incidencia crítica, opcionalmente se puede marcar la ruta
        if ("Critico".equalsIgnoreCase(incidencia.getTipo())) {
            ruta.setEstado("Con Incidencia");
            logisticaService.guardarConductor(ruta.getConductor()); // persistir cualquier actualización si aplica
        }
        
        return incidenciaRepository.save(incidencia);
    }

    public List<Incidencia> listarIncidenciasPorRuta(Long idRuta) {
        return incidenciaRepository.findByRutaIdRuta(idRuta);
    }

    public List<Incidencia> listarTodasIncidencias() {
        return incidenciaRepository.findAll();
    }

    public Incidencia obtenerIncidencia(Long id) {
        return incidenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con ID: " + id));
    }

    @Transactional
    public Incidencia actualizarIncidencia(Long id, Incidencia data) {
        Incidencia incidencia = obtenerIncidencia(id);
        incidencia.setTipo(data.getTipo());
        incidencia.setDescripcion(data.getDescripcion());
        return incidenciaRepository.save(incidencia);
    }

    public void eliminarIncidencia(Long id) {
        incidenciaRepository.deleteById(id);
    }

    // --- Entregas ---
    @Transactional
    public Entrega confirmarEntrega(Entrega entrega) {
        Ruta ruta = logisticaService.obtenerRuta(entrega.getRuta().getIdRuta());
        
        if ("Entregado".equalsIgnoreCase(ruta.getEstado())) {
            throw new BusinessRuleException("Esta ruta ya ha sido entregada previamente");
        }

        entrega.setRuta(ruta);
        Entrega savedEntrega = entregaRepository.save(entrega);

        // Actualizar datos de la ruta y liberar recursos (vehículo y conductor vuelven a estar "Disponible")
        ruta.setFechaLlegada(LocalDateTime.now());
        logisticaService.liberarRecursosRuta(ruta, "Entregado");

        return savedEntrega;
    }

    public List<Entrega> listarTodasEntregas() {
        return entregaRepository.findAll();
    }

    public Entrega obtenerEntrega(Long id) {
        return entregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrega no encontrada con ID: " + id));
    }

    @Transactional
    public Entrega actualizarEntrega(Long id, Entrega data) {
        Entrega entrega = obtenerEntrega(id);
        entrega.setEstadoMaterial(data.getEstadoMaterial());
        entrega.setObservaciones(data.getObservaciones());
        return entregaRepository.save(entrega);
    }

    public void eliminarEntrega(Long id) {
        entregaRepository.deleteById(id);
    }
}
