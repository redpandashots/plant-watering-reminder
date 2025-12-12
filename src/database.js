// InstantDB configuration
import { init } from '@instantdb/react';

// Initialize InstantDB with your App ID
const APP_ID = '4f33a3e4-799a-4939-a26b-192198130a38';

const db = init({ appId: APP_ID });

export default db;

