const HelloWorld = artifacts.require('HelloWorld');

contract('HelloWorld', async function () {
    it('should initialise correctly', async function () {
        let instance = await HelloWorld.deployed();
        let message = await instance.getMessage();
        assert(message === 'Hello Again!',
            'Message should be Hello Again!');
    });
    it('should set the message correctly', async function () {
        let instance = await HelloWorld.deployed();
        await instance.setMessage('New Message!');
        let message = await instance.getMessage();
        assert(message === 'New Message!',
            'Message should be New Message!');
    })
})