import { createWallet, KinClient, KinProd, KinTest } from "@kin-sdk/client";

function WalletException(message, e) {
  this.message = message;
  this.exception = e;
}

export async function setupWallet(walletDetails, productionEvironment = false) {
  if (walletDetails) {
    let wallet = createWallet("import", walletDetails);
    let tokenAccounts = await resolveTokenAccounts(
      wallet,
      productionEvironment
    );

    return {
      wallet: wallet,
      tokenAccounts: tokenAccounts,
    };
  } else {
    let wallet = createWallet("create", {});

    // create account
    await createAccount(wallet, productionEvironment);

    let tokenAccounts = await resolveTokenAccounts(
      wallet,
      productionEvironment
    );

    return {
      wallet: wallet,
      tokenAccounts: tokenAccounts,
    };
  }
}

export async function createAccount(wallet, productionEvironment = false) {
  var client = new KinClient(productionEvironment ? KinProd : KinTest);
  try {
    const [result, error] = await client.createAccount(wallet.secret);
    if (error) {
      throw new WalletException("Cannot create account", error);
    } else {
      return await resolveTokenAccounts(wallet, productionEvironment);
    }
  } catch (e) {
    throw new WalletException("Cannot create account", e);
  }
}

export async function resolveTokenAccounts(
  wallet,
  productionEvironment = false
) {
  var client = new KinClient(productionEvironment ? KinProd : KinTest);
  try {
    const [result, error] = await client.resolveTokenAccounts(wallet.publicKey);
    if (error) {
      return WalletException("Cannot create token account", error);
    }

    return result;
  } catch (e) {
    throw new WalletException("Cannot create token account", e);
  }
}

export async function requestAirdrop(
  wallet,
  amount,
  callback,
  productionEvironment = false
) {
  var client = new KinClient(productionEvironment ? KinProd : KinTest);
  try {
    var tokenAccounts = await resolveTokenAccounts(
      wallet,
      productionEvironment
    );

    const [result, error] = await client.requestAirdrop(
      wallet.publicKey,
      amount
    );
    if (error) {
      throw new WalletException("Cannot request airdrop", error);
    }

    if (callback) {
      callback({
        wallet: wallet,
        tokenAccounts: tokenAccounts,
      });
    }
  } catch (e) {
    throw new WalletException("Cannot request airdrop", e);
  }
}

export async function submitPayment(
  wallet,
  destinationAddress,
  amount,
  memo,
  onPaymentSubmitCallback,
  onPaymentEndCallback,
  productionEvironment = false
) {
  onPaymentSubmitCallback();
  var client = new KinClient(productionEvironment ? KinProd : KinTest);
  try {
    const [result, e] = await client.submitPayment({
      secret: wallet.secret,
      tokenAccount: wallet.publicKey,
      amount: amount,
      destination: destinationAddress,
      memo: memo,
    });
    if (e) {
      onPaymentEndCallback({ success: false, transaction: null, error: e });
    } else {
      let tokenAccounts = await resolveTokenAccounts(
        wallet,
        productionEvironment
      );
      onPaymentEndCallback({
        success: true,
        transaction: result,
        wallet: wallet,
        tokenAccounts: tokenAccounts,
        error: null,
      });
    }
  } catch (e) {
    onPaymentEndCallback({ success: false, transaction: null, error: e });
  }
}
