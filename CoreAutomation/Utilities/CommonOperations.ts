import axios from 'axios';
import { Base } from './Base';
import * as fs from 'fs';
import * as path from 'path';

export class CommonOperations {

    public static readConfiguration(): any {
        const configPath = path.join(
          __dirname,
          '../Configuration/Configuration.json',
        );
    
        try {
          const configData = fs.readFileSync(configPath, 'utf-8');
          return JSON.parse(configData);
        } catch (error: any) {
          console.error(`Error reading configuration file: ${error.message}`);
          throw error;
        }
      }
      
}
