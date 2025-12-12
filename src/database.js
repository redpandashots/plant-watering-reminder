// InstantDB configuration
import { init } from '@instantdb/react';
import schema from './instant.schema';

// Initialize InstantDB with your App ID and schema
const APP_ID = '4f33a3e4-799a-4939-a26b-192198130a38';

const db = init({ 
  appId: APP_ID,
  schema
});

export default db;

