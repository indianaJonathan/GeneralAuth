const bcrypt = require('bcrypt');
require('dotenv').config();

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      id: 1,
      name: "General Auth Admin",
      email: "admin@generalauth.com",
      document: "000",
      document_type: "FAKE",
      username: "admin",
      enc_pass: "$2b$12$4fZuwQL.kPZPBjG0eea8EOhhZQTg83juCEj65DDFGJtwQBr/CooXi",
      last_login: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { where: { email: "admin@generalauth.com" } });
  }
};
