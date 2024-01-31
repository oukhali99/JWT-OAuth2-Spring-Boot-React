package com.oukhali99.project.config;

import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.exception.MyExceptionWrapper;
import com.oukhali99.project.model.apiresponse.ApiExceptionResponse;
import com.oukhali99.project.model.apiresponse.ApiResponse;
import com.oukhali99.project.model.apiresponse.BaseApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingRequestValueException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@ControllerAdvice
@RestControllerAdvice
@Slf4j
public class CustomExceptionHandler {

    @ExceptionHandler(MyException.class)
    protected ResponseEntity<ApiResponse> handleMyException(MyException myException) {
        log.error("Error", myException);
        return new ResponseEntity<>(
                new ApiExceptionResponse(myException),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler({
            MissingServletRequestParameterException.class,
            MissingRequestHeaderException.class
    })
    protected ResponseEntity<ApiResponse> handleMissingServletRequestParameter(MissingRequestValueException exception) {
        return handleMyException(
                new MyExceptionWrapper(exception)
        );
    }

}
