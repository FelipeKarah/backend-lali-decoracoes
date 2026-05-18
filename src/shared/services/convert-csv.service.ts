import { HttpException } from '@nestjs/common'
import * as csv from 'csv-parser'
import * as fs from 'fs'

type TEMPLATE = string[]

export class ConvertCsvService {
  public static readonly TEMPLATE_BRANCH: TEMPLATE = [
    'contact_email',
    'address_cep',
    'address_address',
    'address_number',
    'address_complementation',
    'address_district',
    'address_city',
    'address_state',
    'bank_BCID',
    'bank_reponsible_name',
    'bank_cnpj',
    'bank_agency',
    'bank_account',
    'opening_sunday_open',
    'opening_sunday_close',
    'opening_monday_open',
    'opening_monday_close',
    'opening_tuesday_open',
    'opening_tuesday_close',
    'opening_wednesday_open',
    'opening_wednesday_close',
    'opening_thursday_open',
    'opening_thursday_close',
    'opening_friday_open',
    'opening_friday_close',
    'opening_saturday_open',
    'opening_saturday_close',
  ]

  public static readonly TEMPLATE_BRANCH_ADMIN: TEMPLATE = [
    'contact_email',
    'address_cep',
    'address_address',
    'address_number',
    'address_complementation',
    'address_district',
    'address_city',
    'address_state',
    'bank_BCID',
    'bank_reponsible_name',
    'bank_cnpj',
    'bank_agency',
    'bank_account',
    'integrator',
    'pc_code',
    'opening_sunday_open',
    'opening_sunday_close',
    'opening_monday_open',
    'opening_monday_close',
    'opening_tuesday_open',
    'opening_tuesday_close',
    'opening_wednesday_open',
    'opening_wednesday_close',
    'opening_thursday_open',
    'opening_thursday_close',
    'opening_friday_open',
    'opening_friday_close',
    'opening_saturday_open',
    'opening_saturday_close',
  ]

  public static readonly TEMPLATE_INTEGRATOR: TEMPLATE = [
    'name',
    'contact_phone',
    'contact_email',
  ]

  // async convertSingleCsv(
  //   template: TEMPLATE,
  //   files: Express.Multer.File,
  // ): Promise<any> {
  //   const result = [];
  //   let isValidFile = true;
  //   const s = fs
  //     .createReadStream(files[0].path.toString())
  //     .pipe(
  //       csv({
  //         separator: ';',
  //         // headers: [
  //         //   ...this.TEMPLATE_BRANCH
  //         // ],
  //       }),
  //     )
  //     .on('data', (data) => {
  //       const lengthProps = Object.keys(data).length;
  //       if (template.length !== lengthProps) isValidFile = false;

  //       Object.keys(data).map((key) => {
  //         if (!template.includes(key)) isValidFile = false;
  //       });

  //       result.push(data);
  //     });

  //   return new Promise(function (resolve, reject) {
  //     s.on('end', async () => {
  //       if (!isValidFile) reject(new HttpException('Invalid file', 400));

  //       resolve(result);
  //     });
  //   });
  // }
}
