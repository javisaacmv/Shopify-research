import {ObjectSchema} from 'realm';

export const BuyerIdentitySchema: ObjectSchema = {
  name: 'BuyerIdentity',
  embedded: true,
  properties: {
    countryCode: 'string',
  },
};

export const LineItemsSchema: ObjectSchema = {
  name: 'LineItems',
  embedded: true,
  properties: {
    quantity: 'int',
    variantId: 'string',
  },
};

export const ShippingAddressSchema: ObjectSchema = {
  name: 'ShippingAddress',
  embedded: true,
  properties: {
    address1: 'string',
    address2: 'string',
    city: 'string',
    company: 'string',
    country: 'string',
    firstName: 'string',
    lastName: 'string',
    phone: 'string',
    province: 'string',
    zip: 'string',
  },
};

export const CheckoutSchema: ObjectSchema = {
  name: 'Checkout',
  properties: {
    _id: 'string',
    id: 'int?',
    allowPartialAddresses: 'bool',
    buyerIdentity: 'BuyerIdentity',
    email: 'string',
    lineItems: {type: 'list', objectType: 'LineItems'},
    shippingAddress: 'ShippingAddress',
  },
  primaryKey: '_id',
};
