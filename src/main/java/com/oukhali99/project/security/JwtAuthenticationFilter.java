package com.oukhali99.project.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.model.apiresponse.ApiExceptionResponse;
import com.oukhali99.project.security.exception.MyExceptionWrapperBadJwtToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = authHeader.substring(7);
        String username;
        try {
            username = jwtService.extractUsername(jwtToken);

            if (username == null) {
                throw new MyExceptionWrapperBadJwtToken(new Exception("Bad JWT username field"));
            }
        } catch (MyException e) {
            customizeResponseWithException(response, e);
            return;
        }


        UserDetails userDetails;
        try {
            userDetails = userService.findByEmail(username);
        } catch (MyException e) {
            customizeResponseWithException(response, e);
            return;
        }

        // Check if the token is invalid
        boolean isTokenValid = false;
        try {
            isTokenValid = jwtService.isTokenValid(jwtToken, userDetails);

            if (!isTokenValid) {
                throw new MyExceptionWrapperBadJwtToken(new Exception("Invalid JWT Token"));
            }
        } catch (MyException e) {
            customizeResponseWithException(response, e);
            return;
        }

        // Check if already authenticated
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

        filterChain.doFilter(request, response);
    }

    private void customizeResponseWithException(HttpServletResponse response, MyException exception) throws IOException {
        log.error(exception.getMessage());
        exception.printStackTrace();
        customizeResponse(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                objectMapper.writeValueAsString(
                        new ApiExceptionResponse(new MyExceptionWrapperBadJwtToken(exception))
                )
        );
    }

    private void customizeResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.getWriter().write(message);
        response.getWriter().flush();
    }

}
