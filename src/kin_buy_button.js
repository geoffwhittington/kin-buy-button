import React, { useState, useEffect } from "react";
import { ReactComponent as KinIcon } from "./KIN.svg";
import SvgIcon from "@material-ui/core/SvgIcon";
import ProgressButton from "./progress_button";
import { setupWallet, submitPayment } from "./lib";

export default function KinBuyButton(props) {
  const [wallet, setWallet] = useState();
  const [created, setCreated] = useState();
  const [sending, setSending] = useState(false);
  const [productionEvironment, setProductionEnvironment] = useState(false);

  const initWallet = () => {
    const localSetupWallet = async () => {

      let wallet = null;
      let walletDetails = window.localStorage.getItem("wallet");
      if (walletDetails) {
        wallet = JSON.parse(walletDetails);
      }

      let wallet_and_accounts = await setupWallet(wallet);

      if (wallet_and_accounts) {
        setWallet(wallet_and_accounts.wallet, productionEvironment);
        window.localStorage.setItem(
          "wallet",
          JSON.stringify(wallet_and_accounts.wallet)
        );
        props.onAccountUpdate(wallet_and_accounts);
        setCreated(true);
      }
    }
    return localSetupWallet();
  };

  useEffect(() => {
    initWallet();
  }, []);

  return (
    <div className="App">
      {!created && <>Creating Kin wallet ....</>}
      {created && (
        <ProgressButton
          startIcon={
            <SvgIcon titleAccess="KIN" style={{ height: 15, width: 15 }}>
              <KinIcon />
            </SvgIcon>
          }
          variant="contained"
          loading={sending}
          onClick={async () => {
            setSending(true);
            await submitPayment(
              wallet,
              props.destinationAddress,
              props.kinAmount,
              props.memo,
              props.onPaymentSubmitCallback,
              props.onPaymentEndCallback,
              productionEvironment
            );
            setSending(false);
          }}
        >
          {props.kinAmount}
        </ProgressButton>
      )}
    </div>
  );
}
