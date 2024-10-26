import fs from 'fs';
import path from 'path';
import Fuse from 'fuse.js';

// Read the JSON file and parse it
const jsonPath = process.env.STATIC_PATH || '/public';
const jsonFile = path.join(process.cwd(), jsonPath, 'regions.json');
const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

const options = { keys: ['fullname'] };

// Create the Fuse index
const dsIndex = Fuse.createIndex(options.keys, jsonData)

export const datasource = new Fuse(jsonData, options, dsIndex);