import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface CsvData {
  User: string;
  Message: string;
}

@Injectable()
export class AppService {
  parseCsv(text: string): string[] {
    let startIdx = 0;
    let quote = false;
    const values = [];

    for (let i = 0; i < text.length; i++) {
      if (text[i] === '"') {
        quote = !quote;
      } else if (text[i] === ',' && !quote) {
        values.push(text.slice(startIdx, i));
        startIdx = i + 1;
      }
    }

    values.push(text.slice(startIdx));

    return values.map((value) => (value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value));
  }

  extractData(): CsvData[] {
    const targetDate = '2023.4.2';
    const [year, month, day] = targetDate.split('.').map(Number);
    const filename = `${year}${month}${day}.csv`;
    const csvFilePath = path.join(process.cwd(), `public/csv/${filename}`);
    const csvFile = fs.readFileSync(csvFilePath, 'utf8');

    const records = csvFile.trim().split(/\n(?=\d{4}\.\d+\.\d+\s\d+:\d+)/);
    const headers = records[0].split(',').map((header) => header.trim());

    const messageData: CsvData[] = [];
    const urlData: CsvData[] = [];
    const urlRegex = /(http[s]?:\/\/[^\s]*)(\s|$)/g;

    const excludePhrases = [
      '사진',
      '이모티콘',
      '채팅방 관리자가 메시지를 가렸습니다.',
      '삭제된 메시지입니다',
      '나갔습니다',
      '들어왔습니다',
      '안녕하세',
      '반갑습니다',
      '부탁드립니다',
    ];

    for (const record of records.slice(1)) {
      const line = record.split('\n');
      const data = this.parseCsv(line[0]).map((value) => value.trim());

      if (data[0].split(' ')[0] === targetDate) {
        const obj: CsvData = { Message: '', User: '' };
        headers.forEach((header, i) => {
          if (header !== 'Date') {
            obj[header as keyof CsvData] = data[i] ?? '';
          }
        });

        obj.Message += `${line.slice(1).join(' ').trim()}`;

        const match = obj.Message.match(urlRegex);
        if (match) {
          for (const url of match) {
            const urlObj: CsvData = { Message: url.trim(), User: obj.User };
            urlData.push(urlObj);
          }
        }

        const isExcluded = excludePhrases.some((phrase) => obj.Message.includes(phrase));

        if (!isExcluded) {
          messageData.push(obj);
        }
      }
    }

    const messageFilePath = path.join(process.cwd(), 'public/data/', `${targetDate.replace(/\./g, '')}_message.json`);
    const urlFilePath = path.join(process.cwd(), 'public/data/', `${targetDate.replace(/\./g, '')}_url.json`);

    fs.writeFileSync(messageFilePath, JSON.stringify(messageData, null, 2));
    fs.writeFileSync(urlFilePath, JSON.stringify(urlData, null, 2));

    return messageData;
  }
}
