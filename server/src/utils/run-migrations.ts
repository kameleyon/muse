import { supabaseClient } from '../services/supabase';
import fs from 'fs';
import path from 'path';

const runMigrations = async () => {
  console.log('Running database migrations...');
  
  const migrationsDir = path.join(__dirname, '..', '..', '..', 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();
  
  for (const file of files) {
    if (file.endsWith('.sql')) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      try {
        // @ts-ignore - The raw method exists on the client, but TypeScript doesn't recognize it
        const { error } = await (supabaseClient as any).raw(sql);
        if (error) throw error;
        console.log(`✓ ${file} completed successfully`);
      } catch (error) {
        console.error(`✗ ${file} failed:`, error);
        throw error;
      }
    }
  }
  
  console.log('All migrations completed successfully!');
};

runMigrations().catch(console.error);