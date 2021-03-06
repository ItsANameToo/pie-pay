const { Utils, Managers, Transactions, Identities } = require("@arkecosystem/crypto");
const { httpie } = require("@arkecosystem/core-utils");
require("dotenv").config();

const main = async () => {
    try {
        // Set SDK to correct height
        await configureCrypto();

        // Fetch address info for nonce and balance
        const address = Identities.Address.fromPassphrase(process.env.PASSPHRASE);
        let { balance } = await retrieveSenderWallet(address)
        balance = Utils.BigNumber.make(balance);

        // Check if balance > 0
        if (balance.isGreaterThan(Utils.BigNumber.ZERO)) {
            // Create tx to send full balance minus fee to recipient wallet
            const fee = 0.015 * 1e8;

            const transaction = Transactions.BuilderFactory.transfer()
                .recipientId(process.env.RECIPIENT)
                .fee(fee)
                .amount(balance.minus(Utils.BigNumber.make(fee)).toFixed())
                .sign(process.env.PASSPHRASE)
                .build();

            postTransaction([transaction.toJson()])
        } else {
            console.log('Not enough balance, skipping')
        }
    } catch (ex) {
        console.log(ex.message);
    }
}

const retrieveSenderWallet = async sender => {
    try {
        const response = await httpie.get(`${process.env.HOST}/wallets/${sender}`);
        return response.body.data;
    } catch (ex) {
        console.log(sender);
        console.log("retrieveSenderWallet: " + ex.message);
        console.log("Probably a cold wallet");
        return {};
    }
}

const configureCrypto = async () => {
    Managers.configManager.setFromPreset("mainnet");

    try {
        const response = await httpie.get(`${process.env.HOST}/blockchain`);

        Managers.configManager.setHeight(response.body.data.block.height)
    } catch (ex) {
        console.log("configureCrypto: " + ex.message);
        process.exit()
    }
}

const postTransaction = async transactions => {
    try {
        const response = await httpie.post(`${process.env.HOST}/transactions`, {
            headers: { "Content-Type": "application/json", port: 4003 },
            body: {
                transactions: transactions,
            },
        });

        if (response.status !== 200 || response.body.errors) {
            console.log(JSON.stringify(response.body));
        } else {
            console.log('Transaction sent!')
        }
    } catch (ex) {
        console.log(JSON.stringify(ex.message));
    }
}

main();