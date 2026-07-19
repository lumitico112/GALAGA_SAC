package com.galaga.sac.service;

import com.galaga.sac.exception.ResourceNotFoundException;
import com.galaga.sac.model.Contrato;
import com.galaga.sac.repository.ContratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContratoService {

    @Autowired
    private ContratoRepository contratoRepository;

    public List<Contrato> listarContratos() {
        return contratoRepository.findAll();
    }

    public Contrato obtenerContrato(Long id) {
        return contratoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato no encontrado con ID: " + id));
    }

    @Transactional
    public Contrato guardarContrato(Contrato contrato) {
        if (contrato.getEstado() == null || contrato.getEstado().isEmpty()) {
            contrato.setEstado("Activo");
        }
        return contratoRepository.save(contrato);
    }

    @Transactional
    public Contrato actualizarContrato(Long id, Contrato contratoData) {
        Contrato contrato = obtenerContrato(id);
        contrato.setCliente(contratoData.getCliente());
        contrato.setServicio(contratoData.getServicio());
        contrato.setFechaInicio(contratoData.getFechaInicio());
        contrato.setFechaFin(contratoData.getFechaFin());
        contrato.setMonto(contratoData.getMonto());
        contrato.setEstado(contratoData.getEstado());
        return contratoRepository.save(contrato);
    }

    public void eliminarContrato(Long id) {
        Contrato contrato = obtenerContrato(id);
        contratoRepository.delete(contrato);
    }
}
