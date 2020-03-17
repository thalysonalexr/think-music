'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('likes', {
      interpretation_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'interpretations', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      like: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      dislike: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('likes');
  }
};
