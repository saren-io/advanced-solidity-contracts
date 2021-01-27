const People = artifacts.require('People');

module.exports = (deployer) => {
    deployer.deploy(People);
};
