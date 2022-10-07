const models = require("../../DAL/models")

const { Sequelize, sequelize } = models;

const create = async () => {
    try {
        const t = await sequelize.transaction({
            // isolationLevel: Sequelize.Transaction.READ_UNCOMMITED
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })
        return Promise.resolve({
            status: true,
            data: t
        })
    } catch (error) {
        return Promise.reject({
            status: false,
            error
        })
    }
}

const commit = async transaction => {
    try {
        await transaction.commit();
        return Promise.resolve({
            status: true
        })
    } catch (error) {
        await rollback(transaction);
        Promise.reject({
            status: false,
            error
        })
    }
}

const rollback = async transaction => {
    try {
        await transaction.rollback();
    } catch (error) {
        Promise.reject({
            status: false,
            error
        })
    }
}

module.exports = {
    create: create,
    commit: commit,
    rollback: rollback,
}