package ro.devcon.ai.workshop.template;

import org.springframework.ai.chat.client.ChatClient;
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

import java.util.Map;

@SpringBootApplication
@Import(LLMConfig.class)
public class PromptWithTemplateMain {

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(PromptWithTemplateMain.class);
        springApplication.setWebApplicationType(WebApplicationType.NONE);
        springApplication.setBannerMode(Banner.Mode.OFF);
        springApplication.run(args);
    }

    @Bean
    public ApplicationRunner runner(ChatClient chatClient) {
        return args -> {
            PromptTemplate promptTemplate = new PromptTemplate("Tell us a {adjective} joke about {topic}");
            Prompt prompt = promptTemplate.create(Map.of(
                    "adjective", "funny",
                    "topic", "Teaching AI to children"
            ));

            System.out.println("Waiting for a joke about teaching AI to children...");
            System.out.println(chatClient.prompt(prompt)
                                         .call()
                                         .content());
        };
    }
}
