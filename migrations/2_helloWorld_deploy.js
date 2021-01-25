const HelloWorld = artifacts.require('HelloWorld');

module.exports = function (deployer, network, accounts) {
    deployer.deploy(HelloWorld).then(instance => {
        instance.setMessage('Hello Again!', {value: 1000000, from: accounts[0]}).then(() => {
            console.log('Success!');
        }).catch(e => console.log('Error: ', e.message));
    }).catch(e => console.log('Deploy failed: ', e.message));
};
