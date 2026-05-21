package org.danielbreves.backend.service;

import org.danielbreves.backend.repository.FocusRepository;
import org.springframework.stereotype.Service;

@Service
public class FocusService {

    private final FocusRepository focusRepository;

    public FocusService(FocusRepository focusRepository) {
        this.focusRepository = focusRepository;
    }
}
