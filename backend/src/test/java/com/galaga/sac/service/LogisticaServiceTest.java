package com.galaga.sac.service;

import com.galaga.sac.exception.ResourceNotFoundException;
import com.galaga.sac.model.Conductor;
import com.galaga.sac.repository.ConductorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LogisticaServiceTest {

    @Mock
    private ConductorRepository conductorRepository;

    @InjectMocks
    private LogisticaService logisticaService;

    @Test
    void obtenerConductor_Success() {
        Conductor mock = new Conductor();
        mock.setIdConductor(1L);
        mock.setNombre("Juan");

        when(conductorRepository.findById(1L)).thenReturn(Optional.of(mock));

        Conductor res = logisticaService.obtenerConductor(1L);
        assertNotNull(res);
        assertEquals("Juan", res.getNombre());
    }

    @Test
    void obtenerConductor_NotFound() {
        when(conductorRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            logisticaService.obtenerConductor(99L);
        });
    }
}
