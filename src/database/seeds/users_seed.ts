import Knex from 'knex';
import bc from 'bcryptjs'

export async function seed(knex:Knex){
    await knex('users').insert([
        { name: 'Edson', email: 'edson@email.com', password: await bc.hash('12345', await bc.genSalt(10))},
        { name: 'Francisco', email: 'francisco@email.com', password: await bc.hash('12345', await bc.genSalt(10))},
        { name: 'Daniel', email: 'daniel@email.com', password: await bc.hash('12345', await bc.genSalt(10))}
    ])
}