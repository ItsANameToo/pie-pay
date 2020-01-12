
# Pie-pay

## Installation

- Save the directory somewhere on your server, for example in your home directory
- Navigate to the directory
- Run `yarn`
- Run `cp .env.example .env` following by `nano .env`. You should see a configuration file like below:

```bash
# Recipient wallet for funds
RECIPIENT=

# Passphrase of sending wallet
PASSPHRASE=

# URL of the host, without trailing /
HOST=
```

- Fill this with sensible values, for example:

```bash
# Recipient wallet for funds
RECIPIENT=DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8

# Passphrase of sending wallet
PASSPHRASE="spawn choose forest decade first discover crystal elegant smoke skirt club check"

# URL of the host, without trailing /
HOST=https://dexplorer.ark.io/api
```

- Save the file with `Ctrl + O`, and quit it with `Ctrl + X`
- Check where node is installed by running `which node`, save the path it outputs as you'll need it next!
- Run `crontab -e` and move to the end of the file to add a cronjob to have the script run on an interval. You can define your own by checking https://crontab.guru . An example that would run the script every 30 minutes is:

```bash
*/30 * * * * cd ~/pie-pay && /usr/local/bin/node index.js > /dev/null 2>&1
```

Make sure to substitute `/usr/local/bin/node` with the path you got when you ran `which node` and change `~/pie-pay` to the path at which you can find the directory that contains the script.