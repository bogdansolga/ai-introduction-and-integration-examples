package ro.devcon.ai.workshop.role;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import ro.devcon.ai.workshop.common.config.LLMConfig;

import java.util.List;
import java.util.Map;

@SpringBootApplication
@Import(LLMConfig.class)
public class PromptWithRolesMain {

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(PromptWithRolesMain.class);
        springApplication.setWebApplicationType(WebApplicationType.NONE);
        springApplication.setBannerMode(Banner.Mode.OFF);
        springApplication.run(args);
    }

    @Bean
    public ApplicationRunner runner(ChatClient chatClient) {
        return args -> {
            List<Message> messages = List.of(
                    new SystemMessage("You are a Spring & Spring Boot expert"),
                    new UserMessage("Explain the relationship between Dependency Injection and Inversion of Control")
            );

            System.out.println("Using a role, asking an explanation...");
            System.out.println(chatClient.prompt(new Prompt(messages))
                                         .call()
                                         .content());
        };
    }
}
