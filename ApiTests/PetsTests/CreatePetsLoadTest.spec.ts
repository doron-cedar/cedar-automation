import { test, expect } from '@playwright/test';
import axios, { AxiosResponse } from 'axios';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { DataGenerator } from '../../CoreAutomation/Helpers/DataGenerator';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';

const BASE_URL = CommonOperations.readConfiguration().base_Url;
const logger = FileLogger.getInstance('logs/pets_load_test.log', LogLevel.INFO);

test.describe('Pets API - Load Test POST /pet', () => {
    // Load Test: Create 100 Pets concurrently
    test('should create 100 pets concurrently', async () => {
        // Array to store all promises for concurrent requests
        const promises: Promise<void>[] = [];

        // Generate and send 100 POST requests concurrently
        for (let i = 0; i < 100; i++) {
            const petData = DataGenerator.generateRandomPet();
            logger.info(`Request ${i + 1}: Adding a pet with data: ${JSON.stringify(petData)}`);

            // Push each POST request promise into the promises array
            const promise = axios.post(`${BASE_URL}/pet`, petData)
                .then((response: AxiosResponse<any>) => {
                    logger.info(`Response ${i + 1}: ${response.status} - ${JSON.stringify(response.data)}`);

                    // Assertions for each response
                    expect(response.status).toBe(200); // Expecting either 200 OK
                    expect(response.data).toHaveProperty('id');
                    expect(response.data.name).toBe(petData.name);
                    expect(response.data.category).toEqual(petData.category);
                    expect(response.data.photoUrls).toEqual(petData.photoUrls);
                    expect(response.data.tags).toEqual(petData.tags);
                    expect(response.data.status).toBe(petData.status);
                })
                .catch((error: any) => {
                    logger.error(`Request ${i + 1} failed: ${error}`);
                    throw new Error(`Request ${i + 1} failed: ${error}`);
                });

            promises.push(promise);
        }

        // Execute all promises concurrently and wait for all to complete
        await Promise.all(promises);
    });
});
