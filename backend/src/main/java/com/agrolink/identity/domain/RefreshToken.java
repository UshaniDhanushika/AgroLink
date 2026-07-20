package com.agrolink.identity.domain;

import com.agrolink.common.persistence.BaseDocument;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken extends BaseDocument {

    @Indexed
    private String userId;

    @Indexed(unique = true)
    private String token;

    private Instant expiryDate;
}
