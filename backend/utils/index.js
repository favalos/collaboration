const crypto = require("crypto");
const {
  decodeAddress,
  encodeAddress,
  signatureVerify,
} = require("@polkadot/util-crypto");
const { u8aToHex, stringUpperFirst } = require("@polkadot/util");
const { SS58Format } = require("../constants");
const { HttpError } = require("../exc");

function extractPage(ctx) {
  const { page_size: queryPageSize, page: queryPage } = ctx.query;

  let pageSize;
  try {
    pageSize = parseInt(queryPageSize || "");
    pageSize = isNaN(pageSize) ? 10 : Math.max(1, pageSize);
  } catch (e) {
    pageSize = 10;
  }

  let page;
  if (queryPage === "last") {
    page = queryPage;
  } else {
    try {
      page = parseInt(queryPage || "");
      page = isNaN(page) ? 1 : Math.max(1, page);
    } catch (e) {
      page = 1;
    }
  }

  return {
    page,
    pageSize,
  };
}

function handler(obj, method) {
  return obj[method].bind(obj);
}

function md5(str) {
  const md5 = crypto.createHash("md5");
  return md5.update(str).digest("hex");
}

function isValidSignature(signedMessage, signature, address) {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);
  const result = signatureVerify(`<Bytes>${signedMessage}</Bytes>`, signature, hexPublicKey);
  return result.isValid;
}

function validateAddress(address, chain) {
  const ss58Format = SS58Format[stringUpperFirst(chain)];
  if (ss58Format === undefined) {
    throw new HttpError(400, { chain: ["Unsupported relay chain."] });
  }

  const validAddress = encodeAddress(address, ss58Format);
  if (validAddress !== address) {
    throw new HttpError(400, {
      address: [`Not a valid ${chain} ss58format address.`],
    });
  }
}

module.exports = {
  extractPage,
  handler,
  md5,
  isValidSignature,
  validateAddress,
};
