"use client";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export default function Home() {
  const APIURL = process.env.NEXT_PUBLIC_API_KEY;

  const [tokens, setTokens] = useState([]);

  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    const tokensQuery = gql`
      {
        lidoSubmissions(first: 5) {
          amount
          balanceAfter
          sharesAfter
          sharesBefore
        }
        lidoTransfers(first: 5) {
          from
          to
          value
        }
      }
    `;

    const getTokens = async () => {
      try {
        const { data } = await client.query({
          query: tokensQuery,
        });
        console.log("Subgraph data: ", data);
        setTokens(data);
        console.log("Tokens: ", data.lidoSubmissions);
      } catch (err) {
        console.log("Error fetching data: ", err);
      }
    };
    getTokens();
  }, []);

  return (
    <main>
      <div>
        <h1>Tokens Information</h1>
        <div>
          <h2>Lido Submissions</h2>
          <ul>
            {tokens.lidoSubmissions &&
              tokens.lidoSubmissions.map((submission, index) => (
                <li key={index}>
                  <h3>Submission {index + 1}</h3>
                  <p>Amount: {submission.amount}</p>
                  <p>Balance After: {submission.balanceAfter}</p>
                  <p>Shares After: {submission.sharesAfter}</p>
                  <p>Shares Before: {submission.sharesBefore}</p>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h2>Lido Transfers</h2>
          <ul>
            {tokens.lidoTransfers &&
              tokens.lidoTransfers.map((transfer, index) => (
                <li key={index}>
                  <h3>Transfer {index + 1}</h3>
                  <p>From: {transfer.from}</p>
                  <p>To: {transfer.to}</p>
                  <p>Value: {transfer.value}</p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
