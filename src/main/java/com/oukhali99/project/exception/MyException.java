package com.oukhali99.project.exception;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

public abstract class MyException extends Exception {
    @Override
    public abstract String getMessage();
}
