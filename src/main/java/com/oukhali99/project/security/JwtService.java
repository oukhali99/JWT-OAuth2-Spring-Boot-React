package com.oukhali99.project.security;

import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.exception.MyExceptionWrapper;
import com.oukhali99.project.security.exception.MyExceptionWrapperBadJwtToken;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.Nonnull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JwtService {

    @Value("${spring.security.secret-key}")
    private String secretKey;

    public String extractUsername(String jwtToken) throws MyException {
        return extractAllClaims(jwtToken).getSubject();
    }

    public Date extractExpirationDate(String token) throws MyException {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) throws MyException {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String jwtToken) throws MyException {
        try {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(jwtToken)
                    .getBody()
                    ;
        }
        catch (JwtException e) {
            throw new MyExceptionWrapperBadJwtToken(e);
        }
    }

    private Key getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact()
                ;
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) throws MyException {
        return extractUsername(token).equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) throws MyException {
        return extractExpirationDate(token).before(new Date(System.currentTimeMillis()));
    }

}
