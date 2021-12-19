import React, { useEffect, useState } from "react";

export default function NFTVerify() {
  const search = window.location.search;
  const code = new URLSearchParams(search).get("code");

  const [tokens, setTokens] = useState();
  const [wallet, setWallet] = useState();

  useEffect(() => {
    if (!code) {
      return;
    }

    (async () => {
      // Exchange temporary authorization code with permanent user token
      // Implement this on your backend (example in the next code block)
      // Do not expose your API secret key on the client side!
      const user_token_fetch = await fetch("/api/user-token", {
        body: JSON.stringify({
          code: code,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const user_token_response = await user_token_fetch.json();

      // Call the list tokens API
      // Implement this on your backend (example in the next code block)
      // Do not expose your API secret key on the client side!
      const list_tokens_fetch = await fetch("/api/list-tokens", {
        body: JSON.stringify({
          user_token: user_token_response.user_token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const list_tokens_response = await list_tokens_fetch.json();
      setTokens(list_tokens_response.tokens_owned);
      setWallet(list_tokens_response.wallet_address);
    })();
  }, [code]);

  return (
    <>
      {tokens && wallet ? (
        <>
          <h1>Tokens owned by {wallet}</h1>
          {tokens.map((token) => (
            <>
              <p>Name: {token.contract_name}</p>
              <p>Contract Address: {token.contract_address}</p>
              <p>Quantity Owned: {token.quantity}</p>
              <p>ID(s) of token(s) owned: {token.token_ids}</p>
            </>
          ))}
        </>
      ) : (
        <a href="http://connect.inloop.to/oauth/authorize?redirect_uri=YOUR_WEBSITE">
          <img
            src="https://connect.inloop.to/verify-with-nft.svg"
            alt="Verify with NFT"
          />
        </a>
      )}
    </>
  );
}
