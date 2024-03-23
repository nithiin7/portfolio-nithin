import { initializeApollo } from "/lib/apolloClient";
import { HOME_PAGE } from "queries";

const loadData = async () => {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query({
    query: HOME_PAGE,
  });

  return data;
};

export default loadData;
