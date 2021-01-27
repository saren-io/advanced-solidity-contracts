const People = artifacts.require('People');
const truffleAssert = require('truffle-assertions')

contract('People', async (accounts) => {

    let instance, newInstance;

    before(async () => {
        instance = await People.deployed();
    })

    beforeEach(async () => {
        newInstance = await People.new();
    })

    // Additional functions
    // beforeEach, after, afterEach

    it('shouldn\'t create a person with age over 150 years', async () => {
        await truffleAssert.fails(instance.createPerson('Bob', 200, 190, {value: web3.utils.toWei('1', 'ether')}),
            truffleAssert.ErrorType.REVERT);
    });
    it('shouldn\'t create a person without payment', async () => {
        await truffleAssert.fails(instance.createPerson('Bob', 50, 190, {value: 1000}),
            truffleAssert.ErrorType.REVERT);
    });
    it('should set senior status correctly', async () => {
        await instance.createPerson('Bob', 75, 190, {value: web3.utils.toWei('1', 'ether')});
        let bob = await instance.getPerson();
        assert(bob.senior === true, 'Senior level not set');
    });
    // State of contract is preserved
    it('should set age correctly', async () => {
        let bob = await instance.getPerson();
        assert(bob.age.toNumber() === 75, 'Age not set correctly');
    });
    it('should not allow non-owner to delete people', async () => {
        await instance.createPerson('Alice', 25, 170, {from: accounts[1], value: web3.utils.toWei('1', 'ether')});
        await truffleAssert.fails(instance.deletePerson(accounts[1], {from: accounts[1]}),
            truffleAssert.ErrorType.REVERT);
    });
    it('should allow owner to delete people', async () => {
        await newInstance.createPerson('Alice', 25, 170, {from: accounts[1], value: web3.utils.toWei('1', 'ether')});
        await truffleAssert.passes(newInstance.deletePerson(accounts[1], {from: accounts[0]}));
    });
    it('should add 1 ether to balance after creating a person', async () => {
        await newInstance.createPerson('Alice', 25, 170, {from: accounts[2], value: web3.utils.toWei('1', 'ether')});

        let balance = await newInstance.balance();
        let floatBalance = parseFloat(balance);
        let realBalance = await web3.eth.getBalance(newInstance.address);

        assert(floatBalance == web3.utils.toWei('1', 'ether') && floatBalance == realBalance)
    })
    it('should allow the owner to withdraw balance', async function () {
        await newInstance.createPerson('Alice', 25, 170, {from: accounts[2], value: web3.utils.toWei('1', 'ether')});
        await truffleAssert.passes(newInstance.withdrawAll({from: accounts[0]}));
    });
    it('should not allow a non-owner to withdraw balance', async function () {
        await newInstance.createPerson('Alice', 25, 170, {from: accounts[2], value: web3.utils.toWei('1', 'ether')});
        await truffleAssert.fails(newInstance.withdrawAll({from: accounts[2]}), truffleAssert.ErrorType.REVERT);
    });
    it('should increase owners balance after withdrawal', async function () {
        await newInstance.createPerson('Alice', 25, 170, {from: accounts[2], value: web3.utils.toWei('1', 'ether')});

        let balanceBefore = parseFloat(await web3.eth.getBalance(accounts[0]));
        await newInstance.withdrawAll();
        let balanceAfter = parseFloat(await web3.eth.getBalance(accounts[0]));

        assert(balanceBefore < balanceAfter, 'Owners balance was not increased after withdrawal');

    });
    it('should reset balance to 0 after withdrawal', async function () {
        await newInstance.createPerson('Alice', 25, 170, {from: accounts[2], value: web3.utils.toWei('1', 'ether')});

        await newInstance.withdrawAll();
        let balance = await newInstance.balance();
        let floatBalance = parseFloat(balance);
        let realBalance = await web3.eth.getBalance(newInstance.address);

        assert(floatBalance == web3.utils.toWei('0', 'ether') && floatBalance == realBalance, 'Contract balance was not 0 after withdrawal or did not match')

    })
});