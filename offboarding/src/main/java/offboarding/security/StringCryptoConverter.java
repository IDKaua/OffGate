package offboarding.security;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class StringCryptoConverter implements AttributeConverter<String, String> {

    // Instanciamos nosso serviço de criptografia que já estava pronto
    private static final EncryptionService encryptionService = new EncryptionService();

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return attribute;
        }
        // Quando vai salvar no banco, ele encripta
        return encryptionService.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return dbData;
        }
        try {
            // Quando vai ler do banco, ele decripta
            return encryptionService.decrypt(dbData);
        } catch (Exception e) {
            // Caso dê erro (ex: um dado antigo que não estava encriptado), ele retorna normal
            return dbData;
        }
    }
}