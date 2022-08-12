import {gql} from '@apollo/client';

export const CREATE_CUSTOMER = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const GET_CUSTOMER_TOKEN = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CAR_CREATE = gql`
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        createdAt
      }
    }
  }
`;

export const CREATE_CHECKOUT = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
      }
    }
  }
`;

export const CHECKOUT_COMPLETE_FREE = gql`
  mutation checkoutCompleteFree($checkoutId: ID!) {
    checkoutCompleteFree(checkoutId: $checkoutId) {
      checkout {
        id
      }
    }
  }
`;
