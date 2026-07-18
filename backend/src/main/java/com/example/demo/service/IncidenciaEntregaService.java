package com.example.demo.service;

import com.example.demo.model.Entrega;
import com.example.demo.model.Incidencia;
import com.example.demo.model.Ruta;
import com.example.demo.repository.EntregaRepository;
import com.example.demo.repository.IncidenciaRepository;
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

    // --- Entregas ---
    @Transactional
    public Entrega confirmarEntrega(Entrega entrega) {
        Ruta ruta = logisticaService.obtenerRuta(entrega.getRuta().getIdRuta());
        
        if ("Entregado".equalsIgnoreCase(ruta.getEstado())) {
            throw new RuntimeException("Esta ruta ya ha sido entregada previamente");
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
}
