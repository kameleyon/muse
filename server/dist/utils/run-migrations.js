"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("../services/supabase");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const runMigrations = async () => {
    console.log('Running database migrations...');
    const migrationsDir = path_1.default.join(__dirname, '..', '..', '..', 'migrations');
    const files = fs_1.default.readdirSync(migrationsDir).sort();
    for (const file of files) {
        if (file.endsWith('.sql')) {
            console.log(`Running migration: ${file}`);
            const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), 'utf8');
            try {
                // @ts-ignore - The raw method exists on the client, but TypeScript doesn't recognize it
                const { error } = await supabase_1.supabaseClient.raw(sql);
                if (error)
                    throw error;
                console.log(`✓ ${file} completed successfully`);
            }
            catch (error) {
                console.error(`✗ ${file} failed:`, error);
                throw error;
            }
        }
    }
    console.log('All migrations completed successfully!');
};
runMigrations().catch(console.error);
