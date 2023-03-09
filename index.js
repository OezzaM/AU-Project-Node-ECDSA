const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04731bb738dc7e3253d3170911bd7063c937c11b95e9d10305526ad01eccbb6a7079044708f3c897c3381f6087e590dc1a685b5d5c421d9af0341d18335870742e": 100,
  "047e5f0ed8ddc140370c32b65ebccc640e220cc5eb424bb511f9339d0ee055cf1a272703052ea808623c7620d16839a99b23cd0af5dc9406fc3b37bac93515f6df": 50,
  "04af361fce3e08588150eb4908aa92a49144d3c8ab7946cb42702a03ad9ec4ec2de0e25bf2949e8291f79e913ddb8afae9831a3df6b2ae8d196429887db1464df6": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
