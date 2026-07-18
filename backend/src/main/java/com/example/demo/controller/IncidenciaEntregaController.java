package com.example.demo.controller;

import com.example.demo.model.Entrega;
import com.example.demo.model.Incidencia;
import com.example.demo.service.IncidenciaEntregaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class IncidenciaEntregaController {

    @Autowired
    private IncidenciaEntregaService incidenciaEntregaService;

    // --- Incidencias ---
    @PostMapping("/incidencias")
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

    // --- Entregas ---
    @PostMapping("/entregas")
    public ResponseEntity<?> confirmarEntrega(@RequestBody Entrega entrega) {
        try {
            return ResponseEntity.ok(incidenciaEntregaService.confirmarEntrega(entrega));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/entregas")
    public ResponseEntity<List<Entrega>> listarTodasEntregas() {
        return ResponseEntity.ok(incidenciaEntregaService.listarTodasEntregas());
    }
}
