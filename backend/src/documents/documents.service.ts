import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Groq from 'groq-sdk';
import * as fs from 'fs';

@Injectable()
export class DocumentsService {
  private groq: Groq;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) console.warn(" GROQ_API_KEY não encontrada no .env");
    
    this.groq = new Groq({ apiKey: apiKey || 'dummy' });
  }

  private fileToBase64(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
  }

  async processDocument(file: Express.Multer.File) {
    const safeFilePath = file.path || '';

    console.log(`Enviando para análise da IA: ${file.originalname}...`);

    try {
      if (!file.path) {
        throw new Error("Arquivo não salvo em disco. ");
      }

      const base64Image = this.fileToBase64(file.path);
      const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `
                  Analise a imagem fornecida.
                  TAREFA 1 (OCR): Transcreva todo o texto visível.
                  TAREFA 2 (RESUMO): Crie um resumo executivo curto (máximo 5 linhas).

                  FORMATO DE RESPOSTA OBRIGATÓRIO:
                  ---OCR START---
                  (texto aqui)
                  ---OCR END---
                  ---SUMMARY START---
                  (resumo aqui)
                  ---SUMMARY END---
                `,
              },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0.1,
        max_tokens: 1024,
      });

      const fullText = chatCompletion.choices[0]?.message?.content || "";
      const ocrMatch = fullText.match(/---OCR START---([\s\S]*?)---OCR END---/);
      const summaryMatch = fullText.match(/---SUMMARY START---([\s\S]*?)---SUMMARY END---/);

      const cleanOCR = ocrMatch ? ocrMatch[1].trim() : fullText;
      const cleanSummary = summaryMatch ? summaryMatch[1].trim() : "Resumo indisponível.";

      console.log("Processamento finalizado.");

      return this.prisma.document.create({
        data: {
          fileName: file.originalname,
          filePath: safeFilePath, 
          mimeType: file.mimetype,
          size: file.size,
          ocrText: cleanOCR,
          llmSummary: cleanSummary,
        },
      });

    } catch (error) {
      console.error("Erro no processamento:", error);
      
      return this.prisma.document.create({
        data: {
          fileName: file.originalname,
          filePath: safeFilePath, 
          mimeType: file.mimetype,
          size: file.size,
          ocrText: "Falha na leitura.",
          llmSummary: `Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`,
        },
      });
    }
  }

  async getAll() {
    return this.prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async delete(id: number) {
    return this.prisma.document.delete({ where: { id } });
  }
}