import { ethers } from "ethers";
import { decryptPrivateKey } from "./enc-denc";

// Initialize provider using environment variable

export async function initTransaction(
  encryptedPrivateKey = "4265732c8d6221c947d24f72d7b41f71058d4a80da0922435c14ed296f653612",
  toAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  value = "0.0000001",
  password = "234234",
  decryptSalt = "",
  decryptIV = ""
) {
  try {
    const provider = new ethers.providers.InfuraProvider(
      "goerli",
      import.meta.env.VITE_INFURA_API_KEY
    );
    const decrpytedKey = decryptPrivateKey(
      encryptedPrivateKey,
      password,
      decryptIV,
      decryptSalt
    );
    const decryptedKey =
      "e3b31a1c7d66352debd26b630f9d32057f547e589d3337394c0eaf4c897e1500";
    console.log("Decrypted key:", decryptedKey);
    const wallet = new ethers.Wallet(decryptedKey, provider);
    console.log(wallet);
    // Parse the transaction value
    const parsedValue = ethers.utils.parseEther(value);
    console.log(parsedValue);
    // Estimate gas for the transaction
    const estimatedGas = await wallet.estimateGas({
      to: toAddress,
      value: parsedValue,
    });
    console.log(estimatedGas);

    // Construct the transaction object
    const tx = {
      to: toAddress,
      value: parsedValue,
      gasLimit: estimatedGas, // Adjusted to 110% of the estimated gas
    };
    console.log(tx);
    // Send transaction
    const signedTx = await wallet.sendTransaction(tx);
    console.log("Transaction hash:", signedTx.hash);
    await signedTx.wait(); // Wait for transaction confirmation
    console.log("Transaction confirmed");
    return signedTx.hash;

    // Push Protocol integration for notification
  } catch (err) {
    console.error("Error:", err.message);
  }
}
