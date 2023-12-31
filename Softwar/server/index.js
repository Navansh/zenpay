const express = require("express")
const { SerialPort } = require("serialport")
const { ReadlineParser } = require("@serialport/parser-readline")
const cors = require("cors")

const app = express()
app.use(cors())
const port1 = 4000

const port = new SerialPort({
	path: "COM6", //change this to the port your arduino is connected to
	baudRate: 9600,
})

var data1, data2, data3

app.get("/connect", async (req, res) => {
	await connectDevice()
	res.sendStatus(200)
})

app.get("/retrieve", async (req, res) => {
	await reciveData()
	setTimeout(() => {
		res.status(200).json({
			encryptedPrivateKey: data1,
			decryptSalt: data2,
			decryptIV: data3,
		})
	}, 10000)
})
// app.get("/", async (req, res) => {
//   await connectDevice();

//   setTimeout(() => {
//     reciveData();
//   }, 5000);

//   setTimeout(() => {
//     res.send(data1 + "," + data2 + "," + data3);
//   }, 7000);
// });

async function connectDevice() {
	port.write("SecretPassword", function (err) {
		if (err) {
			return console.log("Error on write: ", err.message)
		}
		setTimeout(() => {
			console.log("Connection made")
		}, 10000)
	})

	port.on("error", function (err) {
		console.log("Error: ", err.message)
	})
}

async function reciveData() {
	var data = ""
	var counter = 0
	const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }))

	port.write("SEND", function (err) {
		if (err) {
			return console.log("Error on write: ", err.message)
		}
		setTimeout(() => {
			console.log("Initiated data transfer")
		}, 15000)
	})

	port.on("error", function (err) {
		console.log("Error: ", err.message)
	})

	parser.on("data", (x) => {
		data = x
		counter++

		if (counter == 1) {
			data1 = data
		}
		if (counter == 2) {
			data2 = data
		}

		if (counter == 3) {
			data3 = data
			console.log("Data transfer complete")
			port.close()
		}
	})
}

app.listen(port1, () => {
	console.log(`Server is running on port ${port1}`)
})
