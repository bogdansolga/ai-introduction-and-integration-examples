package net.safedata.ai.workshop.structured;

import net.safedata.ai.workshop.common.config.BeansConfig;
import net.safedata.ai.workshop.common.service.VectorService;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.io.Resource;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

import java.util.List;

@SpringBootApplication
@Import(BeansConfig.class)
@ComponentScan("net.safedata.ai.workshop.common")
public class PromptWithContextRetrievalMain {

    @Value("classpath:/prompts/query-with-placeholders-and-context.st")
    protected Resource queryTemplateWithContext;

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(PromptWithContextRetrievalMain.class);
        springApplication.setWebApplicationType(WebApplicationType.NONE);
        springApplication.setBannerMode(Banner.Mode.OFF);
        springApplication.run(args);
    }

    @Bean
    public ApplicationRunner runner(ChatClient chatClient, VectorService vectorService) {
        return args -> {
            System.out.println("Storing some embeddings...");

            // save some embeddings
            vectorService.storeEmbedding("Spring Boot is a Java framework");
            vectorService.storeEmbedding("Python Django is a web framework");
            vectorService.storeEmbedding("Java helps in enterprise development");

            System.out.println("Querying the vector database...");

            // search for similar content
            List<String> results = vectorService.findSimilar(
                    "Common Java frameworks?",
                    2
            );

            System.out.println("The database results:");
            results.forEach(item -> System.out.println("\t" + item));

            System.out.println("Querying the LLM...");
            String question = "What modern Java frameworks can we use?";
            final PromptTemplate promptTemplate = createPromptTemplate(results, "Java", "medium", question);

            System.out.println(chatClient.prompt(promptTemplate.create())
                                         .call()
                                         .content());
        };
    }

    private PromptTemplate createPromptTemplate(List<String> context,
                                                String domain, String length, String question) {
        final PromptTemplate promptTemplate = new PromptTemplate(queryTemplateWithContext);
        promptTemplate.add("answer-length", length);
        promptTemplate.add("context", context);
        promptTemplate.add("prompt-domain", domain);
        promptTemplate.add("question", question);
        return promptTemplate;
    }
}
