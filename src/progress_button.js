import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function ProgressButton(props) {
  const { children, loading, ...rest } = props;

  const SpinnerAdornment = () => <CircularProgress size={20} />;

  return (
    <Button {...rest}>
      {!loading && children}

      {loading && <SpinnerAdornment {...rest} />}
    </Button>
  );
}
