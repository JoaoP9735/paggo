import { Controller, Post, UseInterceptors, UploadedFile, Get, UseGuards } from '@nestjs/common'; 
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport'; 

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt')) 
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.documentsService.processDocument(file);
  }

  @Get()
  getAll() {
    return this.documentsService.getAll();
  }
}