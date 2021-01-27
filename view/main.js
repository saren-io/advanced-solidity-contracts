let web3 = new Web3(Web3.givenProvider);
let contractInstance;

$(document).ready(async () => {
    await window.ethereum.enable().then(accounts => {
        contractInstance = new web3.eth.Contract(abi, '0xa01d9CD9553a6ADb8912e6A450F7A3825B525898', {from: accounts[0]});
    });
    $('#add_data_button').click(inputData);
    $('#get_data_button').click(displayData);
});

const inputData = () => {
    let name = $('#name_input').val();
    let age = $('#age_input').val();
    let height = $('#height_input').val();

    let config = {
        value: web3.utils.toWei('1', 'ether')
    }

    contractInstance.methods.createPerson(name, age, height).send(config)
        .on('transactionHash', hash => {
            console.log(hash);
        })
        .on('confirmation', confirmations => {
            console.log(confirmations);
        })
        .on('receipt', (receipt) => {
            console.log(receipt);
        })
}

const displayData = async () => {
    const {name, age, height} = await contractInstance.methods.getPerson().call();
    $('#name_output').text(name);
    $('#age_output').text(age);
    $('#height_output').text(height);
}

