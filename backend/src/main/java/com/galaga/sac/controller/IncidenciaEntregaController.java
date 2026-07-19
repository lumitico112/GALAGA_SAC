package com.galaga.sac.controller;

import com.galaga.sac.model.Entrega;
import com.galaga.sac.model.Incidencia;
import com.galaga.sac.service.IncidenciaEntregaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class IncidenciaEntregaController {

    @Autowired
    private IncidenciaEntregaService incidenciaEntregaService;

    // --- Incidencias ---
    @PostMapping("/incidencias")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'CONDUCTOR')")
    public ResponseEntity<Incidencia> registrarIncidencia(@RequestBody Incidencia incidencia) {
        return ResponseEntity.ok(incidenciaEntregaService.registrarIncidencia(incidencia));
    }

    @GetMapping("/incidencias")
    public ResponseEntity<List<Incidencia>> listarTodasIncidencias() {
        return ResponseEntity.ok(incidenciaEntregaService.listarTodasIncidencias());
    }

    @GetMapping("/incidencias/ruta/{idRuta}")
    public ResponseEntity<List<Incidencia>> listarIncidenciasPorRuta(@PathVariable Long idRuta) {
        return ResponseEntity.ok(incidenciaEntregaService.listarIncidenciasPorRuta(idRuta));
    }

    @GetMapping("/incidencias/{id}")
    public ResponseEntity<Incidencia> obtenerIncidencia(@PathVariable Long id) {
        return ResponseEntity.ok(incidenciaEntregaService.obtenerIncidencia(id));
    }

    @PutMapping("/incidencias/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'CONDUCTOR')")
    public ResponseEntity<Incidencia> actualizarIncidencia(@PathVariable Long id, @RequestBody Incidencia incidencia) {
        return ResponseEntity.ok(incidenciaEntregaService.actualizarIncidencia(id, incidencia));
    }

    @DeleteMapping("/incidencias/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarIncidencia(@PathVariable Long id) {
        incidenciaEntregaService.eliminarIncidencia(id);
        return ResponseEntity.noContent().build();
    }

    // --- Entregas ---
    @PostMapping("/entregas")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'CONDUCTOR')")
    public ResponseEntity<Entrega> confirmarEntrega(@RequestBody Entrega entrega) {
        return ResponseEntity.ok(incidenciaEntregaService.confirmarEntrega(entrega));
    }

    @GetMapping("/entregas")
    public ResponseEntity<List<Entrega>> listarTodasEntregas() {
        return ResponseEntity.ok(incidenciaEntregaService.listarTodasEntregas());
    }

    @GetMapping("/entregas/{id}")
    public ResponseEntity<Entrega> obtenerEntrega(@PathVariable Long id) {
        return ResponseEntity.ok(incidenciaEntregaService.obtenerEntrega(id));
    }

    @PutMapping("/entregas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'CONDUCTOR')")
    public ResponseEntity<Entrega> actualizarEntrega(@PathVariable Long id, @RequestBody Entrega entrega) {
        return ResponseEntity.ok(incidenciaEntregaService.actualizarEntrega(id, entrega));
    }

    @DeleteMapping("/entregas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarEntrega(@PathVariable Long id) {
        incidenciaEntregaService.eliminarEntrega(id);
        return ResponseEntity.noContent().build();
    }
}
