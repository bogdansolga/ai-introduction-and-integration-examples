package ro.devcon.ai.workshop.common.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.MetadataMode;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.OpenAiEmbeddingOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.ai.retry.RetryUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LLMConfig {

    @Value("${OPEN-AI.API-KEY}")
    private String openAiApiKey;

    @Bean
    public OpenAiChatModel openAIChatLanguageModel() {
        if (openAiApiKey.length() < 10) {
            System.out.println("Please configure the OpenAI API key before running the programs");
            System.exit(100);
        }
        return new OpenAiChatModel(new OpenAiApi(openAiApiKey));
    }

    @Bean
    public ChatClient openAIChatClient() {
        return ChatClient.builder(openAIChatLanguageModel())
                         .build();
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        return new OpenAiEmbeddingModel(
                new OpenAiApi(openAiApiKey),
                MetadataMode.EMBED,
                OpenAiEmbeddingOptions.builder()
                                      .model("text-embedding-ada-002")
                                      .user("user")
                                      .build(),
                RetryUtils.DEFAULT_RETRY_TEMPLATE);
    }
}
