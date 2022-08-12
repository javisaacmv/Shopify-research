import {gql} from '@apollo/client';

export const GET_PRODUCTS = gql`
  query products($first: Int) {
    products(first: $first) {
      edges {
        cursor
        node {
          id
          title
          description
          handle
          variants(first: $first) {
            edges {
              cursor
              node {
                id
                title
                quantityAvailable
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
