package com.auction.userfinance.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class GhostUserDTO {
    private String name;
    private BigDecimal balance;
    private LocalDateTime lastActivity;

}
