package net.safedata.ai.workshop.common.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@ComponentScan(basePackages = {
        "net.safedata.ai.workshop.common",
        "net.safedata.ai.workshop.common.domain",
        "net.safedata.ai.workshop.common.service"
})
@EnableJpaRepositories(basePackages = "net.safedata.ai.workshop.common.domain.repository")
@EntityScan(basePackages = "net.safedata.ai.workshop.common.domain.entity")
public class BeansConfig {
}
