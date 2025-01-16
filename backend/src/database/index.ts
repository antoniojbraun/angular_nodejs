import { connection } from './connection';

connection.sync({
    // force:true
});
// It is recommended to use sync just in the beginning of the project
// When the project is live and running, is better to use migration, cause sync can delete all the data on the database.

export { connection };