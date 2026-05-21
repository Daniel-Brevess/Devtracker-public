package org.danielbreves.backend.dto.error;

import java.util.Map;

public record ApiErrorResponse(
        String message,
        Map<String, String> fieldErrors
) {
    public static ApiErrorResponse withMessage(String message) {
        return new ApiErrorResponse(message, null);
    }

    public static ApiErrorResponse withFieldErrors(
            String message,
            Map<String, String> fieldErrors
    ) {
        return new ApiErrorResponse(message, fieldErrors);
    }
}
