package org.danielbreves.backend.exception;

import org.danielbreves.backend.dto.error.ApiErrorResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error -> fieldErrors.put(
                        error.getField(),
                        error.getDefaultMessage()
                ));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.withFieldErrors(
                        "Validation failed",
                        fieldErrors
                ));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException exception
    ) {
        String errorMessage = exception.getMostSpecificCause()
                .getMessage()
                .toLowerCase(Locale.ROOT);

        if (errorMessage.contains("email") || errorMessage.contains("username")) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ApiErrorResponse.withMessage(
                            "Email or username is already in use"
                    ));
        }

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiErrorResponse.withMessage(
                        "Operation conflicts with existing related data"
                ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntimeException(
            RuntimeException exception
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.withMessage(exception.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpectedException() {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.withMessage(
                        "An unexpected error occurred"
                ));
    }
}
