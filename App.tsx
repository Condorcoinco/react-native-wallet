import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useCallback, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
const web3 = require("@solana/web3.js")

import { useStoreState } from "./hooks/storeHooks";
import { accountFromSeed, maskedAddress } from "./utils";
import {
  SPL_TOKEN,
  getBalance,
  getHistory,
  getSolanaPrice,
  getTokenBalance,
  transaction,
  tokenTransaction
} from "./api";
import { Keypair } from '@solana/web3.js';



export default function App() {
  var [tokenBalance, tokenBalanceState] = useState(0)

  async function obtenerBalance() {
    console.log(getBalance(new web3.PublicKey("uja3w9XG1g6DQSVT6YASK99FVmdVwXoHVoQEgtEJdLv")));
  }

  async function obtenerPrecioSo() {
    const precioSo = getTokenBalance("uja3w9XG1g6DQSVT6YASK99FVmdVwXoHVoQEgtEJdLv", SPL_TOKEN)
    precioSo.then((value) => {
      tokenBalance = value
      tokenBalanceState(value)
    });
  }

  async function enviarTransfer() {
    await tokenTransaction("uja3w9XG1g6DQSVT6YASK99FVmdVwXoHVoQEgtEJdLv", 1)
  }

  obtenerBalance()
  //enviarTransfer()

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Cuenta Recipiente"
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
      />
      <Button
        onPress={enviarTransfer}
        title="Enviar Tranferencia"
        color="#841584"
      />
      <Button
        onPress={obtenerPrecioSo}
        title="Obtener balance"
        color="#841584"
      />
      <Text>${tokenBalance}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlign: "center",
  },
});
