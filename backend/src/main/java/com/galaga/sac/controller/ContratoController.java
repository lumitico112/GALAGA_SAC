package com.galaga.sac.controller;

import com.galaga.sac.model.Contrato;
import com.galaga.sac.service.ContratoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contratos")
public class ContratoController {

    @Autowired
    private ContratoService contratoService;

    @GetMapping
    public ResponseEntity<List<Contrato>> listarContratos() {
        return ResponseEntity.ok(contratoService.listarContratos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contrato> obtenerContrato(@PathVariable Long id) {
        return ResponseEntity.ok(contratoService.obtenerContrato(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Contrato> crearContrato(@RequestBody Contrato contrato) {
        return ResponseEntity.ok(contratoService.guardarContrato(contrato));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Contrato> actualizarContrato(@PathVariable Long id, @RequestBody Contrato contrato) {
        return ResponseEntity.ok(contratoService.actualizarContrato(id, contrato));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarContrato(@PathVariable Long id) {
        contratoService.eliminarContrato(id);
        return ResponseEntity.noContent().build();
    }
}
