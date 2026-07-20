package com.agrolink.common.exception;

public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String message) {
        super(ErrorCode.NOT_FOUND, message);
    }

    public ResourceNotFoundException(String resource, String id) {
        super(ErrorCode.NOT_FOUND, resource + " not found: " + id);
    }
}
