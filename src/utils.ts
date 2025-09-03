import { BigDecimal } from "generated";
import type BigNumber from "bignumber.js";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const CORE_ADDRESS = "0x4b89bCE8383B1090b30351D69A94dDD1BeE8134B";
export const USDC_ADDRESS = "0x0113A749d4c3cb85ea0Bf3062b41C63acA669d2f";

export const ZERO_BI = 0n;
export const ONE_BI = 1n;

export const ZERO_BD = new BigDecimal(0);
export const ONE_BD = new BigDecimal(1);

export const ALMOST_ZERO_BD = new BigDecimal("0.000001");

export const INITIAL_LIQUIDITY = new BigDecimal("200000");
export const INITIAL_MARKET_CAP = new BigDecimal("100000");
export const INITIAL_PRICE = new BigDecimal("0.001");
export const INITIAL_TOTAL_SUPPLY = new BigDecimal("1000000000");
export const INITIAL_TOKEN_RESERVE = new BigDecimal("1000000000");
export const INITIAL_QUOTE_VIRT_RESERVE = new BigDecimal("100000");

export function exponentToBigDecimal(decimals: number | bigint): BigNumber {
  const d = typeof decimals === "bigint" ? Number(decimals) : decimals;
  return new BigDecimal(10).pow(d);
}

export function convertTokenToDecimal(
  tokenAmount: bigint,
  exchangeDecimals: number | bigint
): string {
  const divisor = exponentToBigDecimal(exchangeDecimals);
  if (divisor.isZero()) return tokenAmount.toString();
  return new BigDecimal(tokenAmount.toString()).dividedBy(divisor).toString(10);
}

export function add(a: string, b: string): string {
  return new BigDecimal(a).plus(b).toString(10);
}

export function sub(a: string, b: string): string {
  return new BigDecimal(a).minus(b).toString(10);
}

export function mul(a: string, b: string): string {
  return new BigDecimal(a).multipliedBy(b).toString(10);
}

export function div(a: string, b: string): string {
  return new BigDecimal(a).dividedBy(b).toString(10);
}

export function min(a: string, b: string): string {
  return new BigDecimal(a).isLessThan(b) ? a : b;
}

export function gt(a: string, b: string): boolean {
  return new BigDecimal(a).isGreaterThan(b);
}

export function lt(a: string, b: string): boolean {
  return new BigDecimal(a).isLessThan(b);
}
