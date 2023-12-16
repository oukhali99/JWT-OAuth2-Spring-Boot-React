package com.oukhali99.project.config;

import com.oukhali99.project.exception.MyException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
@Slf4j
public class RestResponseEntityExceptionHandler {

    @ExceptionHandler(MyException.class)
    protected ResponseEntity<String> handle(MyException myException, WebRequest webRequest) {
        myException.printStackTrace();
        return ResponseEntity.ok(myException.getMessage());
    }

}
