import { test, expect } from '@playwright/test';
import axios from 'axios';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';

const BASE_URL = CommonOperations.readConfiguration().base_Url;
const logger = FileLogger.getInstance('logs/pets_api_test.log', LogLevel.INFO);

test.describe('Pets API - GET /pet/{petid}', () => {
  // Positive Test Case: Valid Pet ID (Existing Pet)
  test('should retrieve a pet by valid pet ID', async () => {
    const petId = 1; // Assuming pet with ID 1 exists
    logger.info(`Request: Retrieving pet with ID: ${petId}`);

    try {
      const response = await axios.get(`${BASE_URL}/pet/${petId}`);
      logger.info(`Response: ${response.status} - ${JSON.stringify(response.data)}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id', petId);
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('status');
    } catch (error: any) {
      logger.error(`Unexpected error: ${error}`);
      throw new Error(`Unexpected error: ${error}`);
    }
  });

  // Negative Test Cases
  test.describe('Negative Test Cases', () => {
    // Invalid Pet ID (Non-numeric)
    test('should return 400 for non-numeric pet ID', async () => {
      const petId = 'abc';
      logger.info(`Request: Retrieving pet with non-numeric ID: ${petId}`);

      try {
        await axios.get(`${BASE_URL}/pet/${petId}`);
      } catch (error: any) {
        if (error.response) {
          logger.info(`Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
          expect(error.response.status).toBe(400);
        } else {
          logger.error(`Unexpected error: ${error}`);
          throw new Error(`Unexpected error: ${error}`);
        }
      }
    });

    // Invalid Pet ID (Negative Number)
    test('should return 400 for negative pet ID', async () => {
      const petId = -1;
      logger.info(`Request: Retrieving pet with negative ID: ${petId}`);

      try {
        await axios.get(`${BASE_URL}/pet/${petId}`);
      } catch (error: any) {
        if (error.response) {
          logger.info(`Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
          expect(error.response.status).toBe(400);
        } else {
          logger.error(`Unexpected error: ${error}`);
          throw new Error(`Unexpected error: ${error}`);
        }
      }
    });

    // Non-existing Pet ID
    test('should return 404 for non-existing pet ID', async () => {
      const petId = 9999; // Assuming pet with ID 9999 does not exist
      logger.info(`Request: Retrieving pet with non-existing ID: ${petId}`);

      try {
        await axios.get(`${BASE_URL}/pet/${petId}`);
      } catch (error: any) {
        if (error.response) {
          logger.info(`Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
          expect(error.response.status).toBe(404);
        } else {
          logger.error(`Unexpected error: ${error}`);
          throw new Error(`Unexpected error: ${error}`);
        }
      }
    });
  });
});
