import knexLib from 'knex';
import knexConfig from './knexfile';

const db = knexLib(knexConfig);

export default db;
