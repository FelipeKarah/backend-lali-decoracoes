import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilePipe implements PipeTransform {
  transform(files: any) {
    files.forEach((element) => {
      if (element === undefined || element === null) {
        throw new BadRequestException(
          'Falha na validação (não foram encontrados arquivos)',
        );
      }

      if (Array.isArray(element) && element.length === 0) {
        throw new BadRequestException(
          'Falha na validação (não foram encontrados arquivos)',
        );
      }

      if (element.mimetype !== 'text/csv') {
        throw new BadRequestException('Apenas arquivos .csv são permitidos');
      }
    });

    return files;
  }
}
