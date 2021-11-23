import * as solanaWeb3 from "@solana/web3.js";
import { PublicKey,Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const splToken = require("@solana/spl-token");
const web3 = require("@solana/web3.js");



import { accountFromSeed } from "../utils";

const LAMPORTS_PER_SOL = solanaWeb3.LAMPORTS_PER_SOL;

const SPL_TOKEN = "7TMzmUe9NknkeS3Nxcx6esocgyj8WdKyEMny9myDGDYJ";

var myMint = new PublicKey(SPL_TOKEN);


const createConnection = () => {
  return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("devnet"));
};

const getBalance = async (publicKey) => {
  const connection = createConnection();
  const _publicKey = publicKeyFromString(publicKey);

  const lamports = await connection.getBalance(_publicKey).catch((err) => {
    console.error(`Error: ${err}`);
  });

  const sol = lamports / LAMPORTS_PER_SOL;
  return sol;
};

const getHistory = async (publicKeyString, options = { limit: 20 }) => {
  const connection = createConnection();
  const history = await connection.getConfirmedSignaturesForAddress2(
    publicKeyFromString(publicKeyString),
    options
  );

  return history;
};

const getSolanaPrice = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`,
    {
      method: "GET",
    }
  );

  const data = await response.json();
  return data.solana.usd;
};

const requestAirDrop = async (publicKeyString: string) => {
  const connection = createConnection();

  const airdropSignature = await connection.requestAirdrop(
    publicKeyFromString(publicKeyString),
    LAMPORTS_PER_SOL
  );

  const signature = await connection.confirmTransaction(airdropSignature);
  return signature;
};

const publicKeyFromString = (publicKeyString: string) => {
  return new solanaWeb3.PublicKey(publicKeyString);
};

const tokenTransaction = async(recibe: string, monto: number) =>{
  console.log("Executing transaction...");


  const DEMO_WALLET_SECRET_KEY = new Uint8Array([245,227,241,78,52,86,34,249,154,108,11,238,175,182,30,183,142,181,39,114,135,60,106,146,197,188,205,100,79,22,57,64,51,190,81,228,64,115,0,1,93,168,72,53,238,168,60,211,151,35,252,21,100,240,0,176,228,240,105,206,47,68,116,28]);
(async () => {
  // Connect to cluster
  var connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  // Construct wallet keypairs
  var fromWallet = web3.Keypair.fromSecretKey(DEMO_WALLET_SECRET_KEY);
  var toWallet = web3.Keypair.generate();
  // Construct my token class
  var myMint = new web3.PublicKey("7TMzmUe9NknkeS3Nxcx6esocgyj8WdKyEMny9myDGDYJ");
  var myToken = new splToken.Token(
    connection,
    myMint,
    splToken.TOKEN_PROGRAM_ID,
    fromWallet
  );
  // Create associated token accounts for my token if they don't exist yet
  var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey
  )
  var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
    new web3.PublicKey(recibe)
  )
  // Add token transfer instructions to transaction
  var transaction = new web3.Transaction()
    .add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        monto * LAMPORTS_PER_SOL
      )
    );
  // Sign transaction, broadcast, and confirm
  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  );
  console.log("SIGNATURE", signature);
  console.log("SUCCESS");
})();

}

//transaccion
const transaction = async (from, to, amount) => {
  console.log("Executing transaction...");
  console.log(amount);

  const connection = createConnection();

  const fromKeyPair = Keypair.fromSecretKey(from.keyPair.secretKey);

 var myToken = new splToken.Token(
    connection,
    myMint,
    splToken.TOKEN_PROGRAM_ID,
    fromKeyPair
  );
 
  var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
      fromKeyPair.publicKey
    )
  var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
    new solanaWeb3.PublicKey(to)
  )


  const transaction = new solanaWeb3.Transaction().add(
    
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      from.keyPair.publicKey,
      [],
      amount * LAMPORTS_PER_SOL
    )

  );
/*
  const transaction = new solanaWeb3.Transaction().add(
    
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: publicKeyFromString(from.keyPair.publicKey.toString()),
      toPubkey: publicKeyFromString(to),
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );
*/
  

  // Sign transaction, broadcast, and confirm
  const signature = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from.keyPair]
  );
  console.log("SIGNATURE", signature);
};

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await solanaWeb3.PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}

const getTokenBalance = async (publicKey: string, splToken: string) => {
  const connection = createConnection();

  const account = await findAssociatedTokenAddress(
    publicKeyFromString(publicKey),
    publicKeyFromString(splToken)
  );

  try {
    const balance = await connection.getTokenAccountBalance(
      publicKeyFromString(account.toString())
    );
    return balance.value.amount / LAMPORTS_PER_SOL;
  } catch (e) {
    return 0;
  }
};

export {
  LAMPORTS_PER_SOL,
  SPL_TOKEN,
  createConnection,
  getBalance,
  getHistory,
  getSolanaPrice,
  publicKeyFromString,
  requestAirDrop,
  transaction,
  getTokenBalance,
  tokenTransaction,
};
