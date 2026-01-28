package com.auction.userfinance.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "wallets")
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private BigDecimal blockedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency;

    @ToString.Exclude
    @OneToOne(mappedBy = "wallet")
    private User user;

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "wallet")
    List<FinancialTransaction> transactions = new ArrayList<>();
}