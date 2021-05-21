import { useState } from "react";
import BuyButton from "./kin_buy_button";
import { requestAirdrop } from "./lib";
import Button from "@material-ui/core/Button";

function App() {
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [paymentSuccess, setPaymentSucess] = useState(false);
  const [walletAccounts, setWalletAccounts] = useState(null);

  const onPaymentSend = async () => {
    setPaymentReceived(false);
  };
  const onPaymentEnd = async (paymentResult) => {
    setPaymentReceived(true);
    setPaymentSucess(paymentResult.success);

    if (paymentResult.success) {
      await onAccountUpdate({
        wallet: paymentResult.wallet,
        tokenAccounts: paymentResult.tokenAccounts,
      });
    }
  };
  const onAccountUpdate = async (wallet_and_accounts) => {
    setWalletAccounts(wallet_and_accounts);
  };
  /*

  */
  return (
    <div className="App">
      {walletAccounts && (
        <>
          <p>
            <strong>Wallet address:</strong> {walletAccounts.wallet.publicKey}
          </p>
          <p>
            <strong>Wallet balance:</strong>{" "}
            {walletAccounts.tokenAccounts[0].balance}
          </p>
        </>
      )}
      <hr />
      <strong>Payment</strong>
      <p>
        <BuyButton
          kinAmount={"1"}
          destinationAddress={"Don8L4DTVrUrRAcVTsFoCRqei5Mokde3CV3K9Ut4nAGZ"}
          memoDetails={"INVOICE123"}
          onAccountUpdate={onAccountUpdate}
          onPaymentSubmitCallback={onPaymentSend}
          onPaymentEndCallback={onPaymentEnd}
        />
      </p>
      {paymentReceived && <>Received payment!</>}
      {paymentReceived && paymentSuccess && <>Payment success!</>}

      <p>
        <Button
          variant="contained"
          onClick={async () => {
            await requestAirdrop(walletAccounts.wallet, "2", onAccountUpdate);
          }}
        >
          Airdrop
        </Button>
      </p>
    </div>
  );
}

export default App;
