import { test, expect } from '@playwright/test';
import axios from 'axios';
import { DataGenerator } from '../../CoreAutomation/Helpers/DataGenerator';
import { CommonOperations } from '../../CoreAutomation/Utilities/CommonOperations';
import { FileLogger, LogLevel } from '../../CoreAutomation/Helpers/FileLogger';

const BASE_URL = CommonOperations.readConfiguration().base_Url;
const logger = FileLogger.getInstance('logs/pets_api_test.log', LogLevel.INFO);

test.describe('Pets API - POST /pet', () => {
    // Positive Test Case: Valid Pet Data
    test('should add a pet using valid pet data', async () => {
        const petData = DataGenerator.generateRandomPet();
        logger.info(`Request: Adding a pet with data: ${JSON.stringify(petData)}`);

        try {
            const response = await axios.post(`${BASE_URL}/pet`, petData);
            logger.info(`Response: ${response.status} - ${JSON.stringify(response.data)}`);

            // Basic response checks
            expect(response.status).toBe(200); // Expecting either 200 OK or 201 Created
            expect(response.data).toHaveProperty('id');
            expect(response.data.name).toBe(petData.name);

            // Check for the presence of category
            expect(response.data).toHaveProperty('category');
            expect(response.data.category).toHaveProperty('id');
            expect(response.data.category).toHaveProperty('name');
            expect(response.data.category.name).toBe(petData.category.name);

            // Check for photoUrls
            expect(response.data).toHaveProperty('photoUrls');
            expect(Array.isArray(response.data.photoUrls)).toBe(true);
            expect(response.data.photoUrls.length).toBeGreaterThan(0);
            expect(response.data.photoUrls[0]).toBe(petData.photoUrls[0]);

            // Check for tags
            expect(response.data).toHaveProperty('tags');
            expect(Array.isArray(response.data.tags)).toBe(true);
            expect(response.data.tags.length).toBeGreaterThan(0);
            expect(response.data.tags[0]).toHaveProperty('id');
            expect(response.data.tags[0]).toHaveProperty('name');
            expect(response.data.tags[0].name).toBe(petData.tags[0].name);

            // Check for status
            expect(response.data).toHaveProperty('status');
            expect(response.data.status).toBe(petData.status);

        } catch (error) {
            logger.error(`Unexpected error: ${error}`);
            // Fail the test if an unexpected error occurs
            throw new Error(`Unexpected error: ${error}`);
        }
    });

    // Negative Test Cases
    // Bad Request Test Cases (400)
    test.describe('Bad Request Test Cases (400)', () => {
        // Missing Required Fields (if applicable)
        test('should handle missing required fields appropriately', async () => {
            const petData = {
                id: 0,
                name: 'Max',
            };
            logger.info(`Request: Adding a pet with missing required fields: ${JSON.stringify(petData)}`);

            try {
                const response = await axios.post(`${BASE_URL}/pet`, petData);
                logger.info(`Response: ${response.status} - ${JSON.stringify(response.data)}`);
                // Document the current behavior
                expect(response.status).toBe(200);
                console.log('API accepted request with missing fields:', response.data);
            } catch (error: any) {
                logger.error(`Unexpected error: ${error}`);
                throw new Error(`Unexpected error: ${error}`);
            }
        });

        // Invalid Data Types
        test('should return 400 for invalid data types', async () => {
            const petData = {
                id: 'string',
                category: {
                    id: 'string',
                    name: 12345,
                },
                name: 12345,
                photoUrls: [12345],
                tags: [
                    {
                        id: 'string',
                        name: 12345,
                    },
                ],
                status: 12345,
            };
            logger.info(`Request: Adding a pet with invalid data types: ${JSON.stringify(petData)}`);

            try {
                await axios.post(`${BASE_URL}/pet`, petData);
                // Fail the test if the request succeeds (should have failed with 400)
                throw new Error('Expected request to fail with 400');
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

        // Invalid payload Types
        test('should return 405 for invalid data types', async () => {
            const petData = [1, "12345", "doggie"]
            logger.info(`Request: Adding a pet with invalid data types: ${JSON.stringify(petData)}`);

            try {
                await axios.post(`${BASE_URL}/pet`, petData);
                // Fail the test if the request succeeds (should have failed with 400)
                throw new Error('Expected request to fail with 405');
            } catch (error: any) {
                if (error.response) {
                    logger.info(`Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
                    expect(error.response.status).toBe(405);
                } else {
                    logger.error(`Unexpected error: ${error}`);
                    throw new Error(`Unexpected error: ${error}`);
                }
            }
        });

        // Exceeding Field Lengths
        test('should return 400 for exceeding field lengths', async () => {
            const petData = {
                id: 0,
                category: {
                    id: 1,
                    name: 'A very very very very very very very_very_very_very long category name',
                },
                name: 'A very very very very very very very_very_very_very long pet name',
                photoUrls: ['http://example.com/photos/a_very_very_very_very_very_very_very_very long_photo_url.jpg'],
                tags: [
                    {
                        id: 1,
                        name: 'A very very very very very very very very very very very very very very very very very very long tag name',
                    },
                ],
                status: 'available',
            };
            logger.info(`Request: Adding a pet with exceeding field lengths: ${JSON.stringify(petData)}`);

            try {
                await axios.post(`${BASE_URL}/pet`, petData);
                // Fail the test if the request succeeds (should have failed with 400)
                throw new Error('Expected request to fail with 400');
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
    });

    // Unsupported payload Test Case (415)
    test.describe('Unsupported payload Test Case (415)', () => {
        // Invalid data
        test('should return 415 for unsupported payload', async () => {
            const petId = 1;
            const petData = DataGenerator.generateRandomPet();
            logger.info(`Request: Adding a pet with unsupported payload: ${JSON.stringify(petData)}`);

            try {
                await axios.post(`${BASE_URL}/pet/${petId}`, petData);
                // Fail the test if the request succeeds (should have failed with 415)
                throw new Error('Expected request to fail with 415');
            } catch (error: any) {
                if (error.response) {
                    logger.info(`Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
                    expect(error.response.status).toBe(415);
                } else {
                    logger.error(`Unexpected error: ${error}`);
                    throw new Error(`Unexpected error: ${error}`);
                }
            }
        });
    });

    // Endpoint not found Test Case (404)
    test.describe('Endpoint not found Test Case (404)', () => {
        test('should return 404 for end point not found', async () => {
            const petData = DataGenerator.generateRandomPet();
            const petId = 10;
            logger.info(`Request: Updating a pet with invalid endpoint: ${BASE_URL}/notFound_endpoint, data: ${JSON.stringify(petData)}`);

            try {
                await axios.put(`${BASE_URL}/notFound_endpoint`, petData);
                // Fail the test if the request succeeds (should have failed with 404)
                throw new Error('Expected request to fail with 404');
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
