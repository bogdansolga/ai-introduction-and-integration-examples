package ro.devcon.ai.workshop.structured;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.Resource;
import ro.devcon.ai.workshop.common.config.LLMConfig;

@SpringBootApplication
@Import(LLMConfig.class)
public class StructuredTemplateMain {

    @Value("classpath:/prompts/query-with-placeholders.st")
    protected Resource firstQueryTemplate;

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(StructuredTemplateMain.class);
        springApplication.setWebApplicationType(WebApplicationType.NONE);
        springApplication.setBannerMode(Banner.Mode.OFF);
        springApplication.run(args);
    }

    @Bean
    public ApplicationRunner runner(ChatClient chatClient) {
        return args -> {
            PromptTemplate promptTemplate = getAIPromptTemplate();
            PromptTemplate funnyPromptTemplate = getFunnyPromptTemplate();

            System.out.println("Using a structured template, asking an explanation...");
            System.out.println(chatClient.prompt(promptTemplate.create())
                                         .call()
                                         .content());
        };
    }

    private PromptTemplate getAIPromptTemplate() {
        return createPromptTemplate("AI integration", "medium",
                "What are the main complexities in using LLMs?");
    }

    private PromptTemplate getFunnyPromptTemplate() {
        return createPromptTemplate("standup comedy", "mediu",
                "Cum explici AI pentru publicul tău, într-un mod cât mai comic?");
    }

    private PromptTemplate createPromptTemplate(String domain, String length, String question) {
        final PromptTemplate promptTemplate = new PromptTemplate(firstQueryTemplate);
        promptTemplate.add("prompt-domain", domain);
        promptTemplate.add("answer-length", length);
        promptTemplate.add("question", question);
        return promptTemplate;
    }
}
