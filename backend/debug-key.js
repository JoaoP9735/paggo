// backend/debug-key.js
require('dotenv').config(); // Carrega sua chave do .env

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ ERRO: Nenhuma chave encontrada no arquivo .env");
    process.exit(1);
}

console.log(`🔑 Testando chave que começa com: ${apiKey.substring(0, 8)}...`);
console.log("📡 Conectando aos servidores do Google...");

// Vamos fazer uma requisição manual para listar os modelos disponíveis
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error("\n❌ ERRO DO GOOGLE:");
            console.error(JSON.stringify(data.error, null, 2));
        } else {
            console.log("\n✅ SUCESSO! Modelos disponíveis para sua chave:");
            // Filtra só os modelos "generateContent"
            const modelosUteis = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name);
            
            console.log(modelosUteis.join("\n"));
            console.log("\n💡 DICA: Use um desses nomes exatos no seu documents.service.ts");
        }
    })
    .catch(err => {
        console.error("❌ Erro de rede:", err);
    });