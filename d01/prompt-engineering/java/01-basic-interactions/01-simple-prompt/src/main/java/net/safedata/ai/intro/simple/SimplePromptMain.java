package net.safedata.ai.intro.simple;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import net.safedata.ai.intro.common.config.LLMConfig;

@SpringBootApplication
@Import(LLMConfig.class)
public class SimplePromptMain {

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(SimplePromptMain.class);
        springApplication.setWebApplicationType(WebApplicationType.NONE);
        springApplication.setBannerMode(Banner.Mode.OFF);
        springApplication.run(args);
    }

    @Bean
    public ApplicationRunner runner(ChatClient chatClient) {
        return args -> {
            String question = "What are the core AI components and their relations?";
            System.out.println("Querying ChatGPT about '" + question + "'...");
            System.out.println(chatClient.prompt(question)
                                         .call()
                                         .content());
        };
    }
}
