/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { Core, Token, Content, Rewarder } from "generated";
import type { HandlerContext } from "generated";
import {
  ADDRESS_ZERO,
  CORE_ADDRESS,
  ZERO_BI,
  ONE_BI,
  ZERO_BD,
  INITIAL_LIQUIDITY,
  INITIAL_MARKET_CAP,
  INITIAL_TOTAL_SUPPLY,
  INITIAL_PRICE,
  INITIAL_QUOTE_VIRT_RESERVE,
  INITIAL_TOKEN_RESERVE,
} from "./utils";
import { convertTokenToDecimal } from "./utils";
import { add, sub, mul, div, gt, lt } from "./utils";
import { USDC_ADDRESS } from "./utils";

// Domain entities context types are available under context.<Entity>

// (event-centric Content handlers removed to comply with domain schema)

Core.Core__TokenCreated.handler(
  async ({ event, context }: { event: any; context: HandlerContext }) => {
    // Directory (singleton keyed by CORE_ADDRESS)
    const dirId = CORE_ADDRESS.toLowerCase();
    const existingDirectory = await context.Directory.get(dirId);
    const directory = existingDirectory ?? {
      id: dirId,
      index: ZERO_BI,
      txCount: ZERO_BI,
      swapVolume: ZERO_BD.toString(10),
      liquidity: ZERO_BD.toString(10),
      curateVolume: ZERO_BD.toString(10),
      contents: ZERO_BI,
    };
    const updatedDirectory = {
      ...directory,
      index: (directory.index as bigint) + ONE_BI,
      txCount: (directory.txCount as bigint) + ONE_BI,
      liquidity: INITIAL_LIQUIDITY.toString(10),
    };
    context.Directory.set(updatedDirectory);

    // User (owner)
    const owner = event.params.owner.toLowerCase();
    const existingUser = await context.User.get(owner);
    const user = existingUser ?? {
      id: owner,
      txCount: ZERO_BI,
      referrer: ADDRESS_ZERO,
    };
    const updatedUser = { ...user, txCount: (user.txCount as bigint) + ONE_BI };
    context.User.set(updatedUser);

    // Token
    const tokenId = event.params.token.toLowerCase();
    const existingToken = await context.Token.get(tokenId);
    const token = existingToken ?? {
      id: tokenId,
      name: event.params.name,
      symbol: event.params.symbol,
      uri: event.params.uri,
      owner,
      txCount: ZERO_BI,
      swapVolume: ZERO_BD.toString(10),
      liquidity: INITIAL_LIQUIDITY.toString(10),
      totalSupply: INITIAL_TOTAL_SUPPLY.toString(10),
      marketCap: INITIAL_MARKET_CAP.toString(10),
      quoteVirtReserve: INITIAL_QUOTE_VIRT_RESERVE.toString(10),
      quoteRealReserve: ZERO_BD.toString(10),
      tokenReserve: INITIAL_TOKEN_RESERVE.toString(10),
      marketPrice: INITIAL_PRICE.toString(10),
      floorPrice: INITIAL_PRICE.toString(10),
      holders: ZERO_BI,
      contents: ZERO_BI,
      contentBalance: ZERO_BD.toString(10),
      curateVolume: ZERO_BD.toString(10),
      creatorRewardsQuote: ZERO_BD.toString(10),
      curatorRewardsQuote: ZERO_BD.toString(10),
      holderRewardsQuote: ZERO_BD.toString(10),
      holderRewardsToken: ZERO_BD.toString(10),
      treasuryRevenueQuote: ZERO_BD.toString(10),
      treasuryRevenueToken: ZERO_BD.toString(10),
      contentRevenueQuote: ZERO_BD.toString(10),
      contentRevenueToken: ZERO_BD.toString(10),
      createdAtTimestamp: BigInt(event.block.timestamp),
      createdAtBlockNumber: BigInt(event.block.number),
      isModerated: event.params.isModerated,
    };
    const updatedToken = {
      ...token,
      txCount: (token.txCount as bigint) + ONE_BI,
    };
    context.Token.set(updatedToken);

    // Content
    const contentId = event.params.content.toLowerCase();
    const existingContent = await context.Content.get(contentId);
    const content = existingContent ?? { id: contentId, token: tokenId };
    const updatedContent = { ...content, token: tokenId };
    context.Content.set(updatedContent);

    // Rewarder
    const rewarderId = event.params.rewarder.toLowerCase();
    const existingRewarder = await context.Rewarder.get(rewarderId);
    const rewarder = existingRewarder ?? { id: rewarderId, token: tokenId };
    context.Rewarder.set(rewarder);

    // TokenPosition for owner
    const tpId = `${tokenId}-${owner}`;
    const existingTokenPosition = await context.TokenPosition.get(tpId);
    const tokenPosition = existingTokenPosition ?? {
      id: tpId,
      token: tokenId,
      user: owner,
      balance: ZERO_BD.toString(10),
      debt: ZERO_BD.toString(10),
      contentCreated: ZERO_BI,
      createdCurations: ZERO_BI,
      createdValue: ZERO_BD.toString(10),
      contentOwned: ZERO_BI,
      contentBalance: ZERO_BD.toString(10),
      curationSpend: ZERO_BD.toString(10),
      creatorRevenueQuote: ZERO_BD.toString(10),
      ownerRevenueQuote: ZERO_BD.toString(10),
      affiliateRevenueQuote: ZERO_BD.toString(10),
      affiliateRevenueToken: ZERO_BD.toString(10),
      curatorRevenueQuote: ZERO_BD.toString(10),
      curatorRevenueToken: ZERO_BD.toString(10),
    };
    context.TokenPosition.set(tokenPosition);
  }
);

// Token Transfer
Token.Transfer.handler(async ({ event, context }) => {
  const tokenId = event.srcAddress.toLowerCase();
  const token = await context.Token.getOrThrow(tokenId);

  const from = event.params.from.toLowerCase();
  const to = event.params.to.toLowerCase();

  const whoKey = `${tokenId}-${from}`;
  const toKey = `${tokenId}-${to}`;

  const who = (await context.TokenPosition.get(whoKey)) ?? {
    id: whoKey,
    token: tokenId,
    user: from,
    balance: ZERO_BD.toString(10),
    debt: ZERO_BD.toString(10),
    contentCreated: ZERO_BI,
    createdCurations: ZERO_BI,
    createdValue: ZERO_BD.toString(10),
    contentOwned: ZERO_BI,
    contentBalance: ZERO_BD.toString(10),
    curationSpend: ZERO_BD.toString(10),
    creatorRevenueQuote: ZERO_BD.toString(10),
    ownerRevenueQuote: ZERO_BD.toString(10),
    affiliateRevenueQuote: ZERO_BD.toString(10),
    affiliateRevenueToken: ZERO_BD.toString(10),
    curatorRevenueQuote: ZERO_BD.toString(10),
    curatorRevenueToken: ZERO_BD.toString(10),
  };
  const toPos = (await context.TokenPosition.get(toKey)) ?? {
    id: toKey,
    token: tokenId,
    user: to,
    balance: ZERO_BD.toString(10),
    debt: ZERO_BD.toString(10),
    contentCreated: ZERO_BI,
    createdCurations: ZERO_BI,
    createdValue: ZERO_BD.toString(10),
    contentOwned: ZERO_BI,
    contentBalance: ZERO_BD.toString(10),
    curationSpend: ZERO_BD.toString(10),
    creatorRevenueQuote: ZERO_BD.toString(10),
    ownerRevenueQuote: ZERO_BD.toString(10),
    affiliateRevenueQuote: ZERO_BD.toString(10),
    affiliateRevenueToken: ZERO_BD.toString(10),
    curatorRevenueQuote: ZERO_BD.toString(10),
    curatorRevenueToken: ZERO_BD.toString(10),
  };

  const amount = convertTokenToDecimal(event.params.value, 18);

  const whoInitial = who.balance;
  const updatedWho = { ...who, balance: sub(who.balance, amount) };
  let holdersDelta: bigint = 0n;
  if (gt(whoInitial, "0.000001") && lt(updatedWho.balance, "0.000001")) {
    holdersDelta = holdersDelta - ONE_BI;
  }
  context.TokenPosition.set(updatedWho);

  const toInitial = toPos.balance;
  const updatedToPos = { ...toPos, balance: add(toPos.balance, amount) };
  if (lt(toInitial, "0.000001") && gt(updatedToPos.balance, "0.000001")) {
    holdersDelta = holdersDelta + ONE_BI;
  }
  context.TokenPosition.set(updatedToPos);

  const updatedTokenHolders = {
    ...token,
    holders: (token.holders as bigint) + holdersDelta,
  };
  context.Token.set(updatedTokenHolders);
});

// Token SyncReserves
Token.Token__SyncReserves.handler(async ({ event, context }) => {
  const tokenId = event.srcAddress.toLowerCase();
  const token = await context.Token.getOrThrow(tokenId);

  const updatedTokenReserves = {
    ...token,
    quoteVirtReserve: convertTokenToDecimal(
      event.params.reserveVirtQuoteWad,
      18
    ),
    quoteRealReserve: convertTokenToDecimal(
      event.params.reserveRealQuoteWad,
      18
    ),
    tokenReserve: convertTokenToDecimal(event.params.reserveTokenAmt, 18),
  };
  const reserveQuote = add(
    updatedTokenReserves.quoteVirtReserve,
    updatedTokenReserves.quoteRealReserve
  );
  const initialLiquidity = token.liquidity;
  const recalculatedToken = {
    ...updatedTokenReserves,
    liquidity: mul(reserveQuote, "2"),
    floorPrice: div(
      updatedTokenReserves.quoteVirtReserve,
      updatedTokenReserves.totalSupply
    ),
    marketPrice: div(reserveQuote, updatedTokenReserves.tokenReserve),
    marketCap: mul(
      div(reserveQuote, updatedTokenReserves.tokenReserve),
      updatedTokenReserves.totalSupply
    ),
  };
  context.Token.set(recalculatedToken);

  const directory = await context.Directory.getOrThrow(
    CORE_ADDRESS.toLowerCase()
  );
  const updatedDir = {
    ...directory,
    liquidity: add(
      sub(directory.liquidity, initialLiquidity),
      recalculatedToken.liquidity
    ),
  };
  context.Directory.set(updatedDir);
});

// Content Created (domain)
Content.Content__Created.handler(async ({ event, context }) => {
  const who = event.params.who.toLowerCase();
  const to = event.params.to.toLowerCase();
  const contentId = event.srcAddress.toLowerCase();

  const userWho = (await context.User.get(who)) ?? {
    id: who,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  const updatedUserWho = {
    ...userWho,
    txCount: (userWho.txCount as bigint) + ONE_BI,
  };
  context.User.set(updatedUserWho);

  const userTo = (await context.User.get(to)) ?? {
    id: to,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  context.User.set(userTo);

  const directory = await context.Directory.getOrThrow(
    CORE_ADDRESS.toLowerCase()
  );
  const updatedDirectory2 = {
    ...directory,
    contents: (directory.contents as bigint) + ONE_BI,
    txCount: (directory.txCount as bigint) + ONE_BI,
  };
  context.Directory.set(updatedDirectory2);

  const content = await context.Content.getOrThrow(contentId);
  const token = await context.Token.getOrThrow(content.token);
  const updatedToken2 = {
    ...token,
    contents: (token.contents as bigint) + ONE_BI,
    txCount: (token.txCount as bigint) + ONE_BI,
  };
  context.Token.set(updatedToken2);

  const cpId = `${content.token}-${event.params.tokenId.toString()}`;
  const contentPosition = (await context.ContentPosition.get(cpId)) ?? {
    id: cpId,
    token: content.token,
    creator: to,
    owner: to,
    tokenId: event.params.tokenId,
    uri: event.params.uri,
    price: "0",
    nextPrice: "1",
    isApproved: !token.isModerated,
    curationCount: ZERO_BI,
  };
  context.ContentPosition.set(contentPosition);

  const tpId = `${token.id}-${to}`;
  const tp = (await context.TokenPosition.get(tpId)) ?? {
    id: tpId,
    token: token.id,
    user: to,
    balance: "0",
    debt: "0",
    contentCreated: ZERO_BI,
    createdCurations: ZERO_BI,
    createdValue: "0",
    contentOwned: ZERO_BI,
    contentBalance: "0",
    curationSpend: "0",
    creatorRevenueQuote: "0",
    ownerRevenueQuote: "0",
    affiliateRevenueQuote: "0",
    affiliateRevenueToken: "0",
    curatorRevenueQuote: "0",
    curatorRevenueToken: "0",
  };
  const updatedTp = {
    ...tp,
    contentCreated: (tp.contentCreated as bigint) + ONE_BI,
  };
  context.TokenPosition.set(updatedTp);
});

// Rewarder Deposited (domain)
Rewarder.Rewarder__Deposited.handler(async ({ event, context }) => {
  const rewarderId = event.srcAddress.toLowerCase();
  const rewarder = await context.Rewarder.getOrThrow(rewarderId);
  const token = await context.Token.getOrThrow(rewarder.token);

  const amount = convertTokenToDecimal(event.params.amount, 6);
  const updatedToken3 = {
    ...token,
    contentBalance: add(token.contentBalance, amount),
  };
  context.Token.set(updatedToken3);

  const tpId = `${token.id}-${event.params.user.toLowerCase()}`;
  const tp = (await context.TokenPosition.get(tpId)) ?? {
    id: tpId,
    token: token.id,
    user: event.params.user.toLowerCase(),
    balance: "0",
    debt: "0",
    contentCreated: ZERO_BI,
    createdCurations: ZERO_BI,
    createdValue: "0",
    contentOwned: ZERO_BI,
    contentBalance: "0",
    curationSpend: "0",
    creatorRevenueQuote: "0",
    ownerRevenueQuote: "0",
    affiliateRevenueQuote: "0",
    affiliateRevenueToken: "0",
    curatorRevenueQuote: "0",
    curatorRevenueToken: "0",
  };
  const updatedTp2 = {
    ...tp,
    contentOwned: (tp.contentOwned as bigint) + ONE_BI,
    contentBalance: add(tp.contentBalance, amount),
    curationSpend: add(tp.curationSpend, amount),
  };
  context.TokenPosition.set(updatedTp2);
});

// Token Swap (domain)
Token.Token__Swap.handler(async ({ event, context }) => {
  const directory = await context.Directory.getOrThrow(
    CORE_ADDRESS.toLowerCase()
  );
  const updatedDirectory3 = {
    ...directory,
    txCount: (directory.txCount as bigint) + ONE_BI,
    swapVolume: add(
      add(
        directory.swapVolume,
        convertTokenToDecimal(event.params.quoteInRaw, 6)
      ),
      convertTokenToDecimal(event.params.quoteOutRaw, 6)
    ),
  };
  context.Directory.set(updatedDirectory3);

  const from = event.params.from.toLowerCase();
  const to = event.params.to.toLowerCase();
  const tokenId = event.srcAddress.toLowerCase();

  const userFrom = (await context.User.get(from)) ?? {
    id: from,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  const updatedUserFrom = {
    ...userFrom,
    txCount: (userFrom.txCount as bigint) + ONE_BI,
  };
  context.User.set(updatedUserFrom);

  const userTo = (await context.User.get(to)) ?? {
    id: to,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  context.User.set(userTo);

  const token = await context.Token.getOrThrow(tokenId);
  const updatedToken4 = {
    ...token,
    txCount: (token.txCount as bigint) + ONE_BI,
    swapVolume: add(
      add(token.swapVolume, convertTokenToDecimal(event.params.quoteInRaw, 6)),
      convertTokenToDecimal(event.params.quoteOutRaw, 6)
    ),
  };
  context.Token.set(updatedToken4);

  const swapId = `${event.chainId}_${event.block.number}_${event.logIndex}`;
  context.Swap.set({
    id: swapId,
    token: token.id,
    user: from,
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp),
    quoteIn: convertTokenToDecimal(event.params.quoteInRaw, 6),
    quoteOut: convertTokenToDecimal(event.params.quoteOutRaw, 6),
    tokenIn: convertTokenToDecimal(event.params.tokenIn, 18),
    tokenOut: convertTokenToDecimal(event.params.tokenOut, 18),
    marketPrice: token.marketPrice,
    floorPrice: token.floorPrice,
  } as any);

  const ts = event.block.timestamp;
  const dayIndex = Math.floor(ts / 86400);
  const dayStart = dayIndex * 86400;
  const dayId = `${token.id}-${dayIndex}`;
  const day = (await context.TokenDayData.get(dayId)) ?? {
    id: dayId,
    token: updatedToken4.id,
    timestamp: BigInt(dayStart),
    marketPrice: updatedToken4.marketPrice,
    floorPrice: updatedToken4.floorPrice,
    volume: "0",
  };
  const updatedDay = {
    ...day,
    marketPrice: updatedToken4.marketPrice,
    floorPrice: updatedToken4.floorPrice,
    volume: add(
      add(day.volume, convertTokenToDecimal(event.params.quoteInRaw, 6)),
      convertTokenToDecimal(event.params.quoteOutRaw, 6)
    ),
  };
  context.TokenDayData.set(updatedDay);

  const hourIndex = Math.floor(ts / 3600);
  const hourStart = hourIndex * 3600;
  const hourId = `${token.id}-${hourIndex}`;
  const hour = (await context.TokenHourData.get(hourId)) ?? {
    id: hourId,
    token: updatedToken4.id,
    timestamp: BigInt(hourStart),
    marketPrice: updatedToken4.marketPrice,
    floorPrice: updatedToken4.floorPrice,
    volume: "0",
  };
  const updatedHour = {
    ...hour,
    marketPrice: updatedToken4.marketPrice,
    floorPrice: updatedToken4.floorPrice,
    volume: add(
      add(hour.volume, convertTokenToDecimal(event.params.quoteInRaw, 6)),
      convertTokenToDecimal(event.params.quoteOutRaw, 6)
    ),
  };
  context.TokenHourData.set(updatedHour);

  const minuteIndex = Math.floor(ts / 60);
  const minuteStart = minuteIndex * 60;
  const minuteId = `${token.id}-${minuteIndex}`;
  const minute = (await context.TokenMinuteData.get(minuteId)) ?? {
    id: minuteId,
    token: updatedToken4.id,
    timestamp: BigInt(minuteStart),
    marketPrice: updatedToken4.marketPrice,
    floorPrice: updatedToken4.floorPrice,
    volume: "0",
  };
  const updatedMinute = {
    ...minute,
    marketPrice: updatedToken4.marketPrice,
    floorPrice: updatedToken4.floorPrice,
    volume: add(
      add(minute.volume, convertTokenToDecimal(event.params.quoteInRaw, 6)),
      convertTokenToDecimal(event.params.quoteOutRaw, 6)
    ),
  };
  context.TokenMinuteData.set(updatedMinute);
});

// Token HealReserves (domain)
Token.Token__HealReserves.handler(async ({ event, context }) => {
  const tokenId = event.srcAddress.toLowerCase();
  const token = await context.Token.getOrThrow(tokenId);
  const updatedTokenHR = {
    ...token,
    quoteVirtReserve: add(
      token.quoteVirtReserve,
      convertTokenToDecimal(event.params.virtAddWad, 18)
    ),
    quoteRealReserve: add(
      token.quoteRealReserve,
      convertTokenToDecimal(event.params.quoteWad, 18)
    ),
  };
  const reserveQuote = add(
    updatedTokenHR.quoteVirtReserve,
    updatedTokenHR.quoteRealReserve
  );
  const initialLiquidity = token.liquidity;
  const recalculatedHR = {
    ...updatedTokenHR,
    liquidity: mul(reserveQuote, "2"),
    floorPrice: div(
      updatedTokenHR.quoteVirtReserve,
      updatedTokenHR.totalSupply
    ),
    marketPrice: div(reserveQuote, updatedTokenHR.tokenReserve),
    marketCap: mul(
      div(reserveQuote, updatedTokenHR.tokenReserve),
      updatedTokenHR.totalSupply
    ),
    holderRewardsQuote: add(
      updatedTokenHR.holderRewardsQuote,
      convertTokenToDecimal(event.params.quoteWad, 18)
    ),
  };
  context.Token.set(recalculatedHR);

  const directory = await context.Directory.getOrThrow(
    CORE_ADDRESS.toLowerCase()
  );
  const updatedDirHR = {
    ...directory,
    liquidity: add(
      sub(directory.liquidity, initialLiquidity),
      recalculatedHR.liquidity
    ),
  };
  context.Directory.set(updatedDirHR);
});

// Token BurnReserves (domain)
Token.Token__BurnReserves.handler(async ({ event, context }) => {
  const tokenId = event.srcAddress.toLowerCase();
  const token = await context.Token.getOrThrow(tokenId);
  const reserveBurn = convertTokenToDecimal(event.params.reserveBurn, 18);
  const tokenAmt = convertTokenToDecimal(event.params.tokenAmt, 18);
  const updatedTokenBR = {
    ...token,
    tokenReserve: sub(token.tokenReserve, reserveBurn),
  };
  const updatedTokenBR2 = {
    ...updatedTokenBR,
    totalSupply: sub(updatedTokenBR.totalSupply, sub(reserveBurn, tokenAmt)),
  };
  const reserveQuote = add(
    updatedTokenBR2.quoteVirtReserve,
    updatedTokenBR2.quoteRealReserve
  );
  const initialLiquidity = token.liquidity;
  const recalculatedBR = {
    ...updatedTokenBR2,
    liquidity: mul(reserveQuote, "2"),
    floorPrice: div(
      updatedTokenBR2.quoteVirtReserve,
      updatedTokenBR2.totalSupply
    ),
    marketPrice: div(reserveQuote, updatedTokenBR2.tokenReserve),
    marketCap: mul(
      div(reserveQuote, updatedTokenBR2.tokenReserve),
      updatedTokenBR2.totalSupply
    ),
    holderRewardsToken: add(updatedTokenBR2.holderRewardsToken, tokenAmt),
  };
  context.Token.set(recalculatedBR);

  const directory = await context.Directory.getOrThrow(
    CORE_ADDRESS.toLowerCase()
  );
  const updatedDirBR = {
    ...directory,
    liquidity: add(
      sub(directory.liquidity, initialLiquidity),
      recalculatedBR.liquidity
    ),
  };
  context.Directory.set(updatedDirBR);
});

// Token ProviderFee (domain)
Token.Token__ProviderFee.handler(async ({ event, context }) => {
  const tokenId = event.srcAddress.toLowerCase();
  const to = event.params.to.toLowerCase();
  const tpId = `${tokenId}-${to}`;
  const tp = (await context.TokenPosition.get(tpId)) ?? {
    id: tpId,
    token: tokenId,
    user: to,
    balance: "0",
    debt: "0",
    contentCreated: ZERO_BI,
    createdCurations: ZERO_BI,
    createdValue: "0",
    contentOwned: ZERO_BI,
    contentBalance: "0",
    curationSpend: "0",
    creatorRevenueQuote: "0",
    ownerRevenueQuote: "0",
    affiliateRevenueQuote: "0",
    affiliateRevenueToken: "0",
    curatorRevenueQuote: "0",
    curatorRevenueToken: "0",
  };
  const updatedTpPF = {
    ...tp,
    affiliateRevenueQuote: add(
      tp.affiliateRevenueQuote,
      convertTokenToDecimal(event.params.quoteRaw, 6)
    ),
    affiliateRevenueToken: add(
      tp.affiliateRevenueToken,
      convertTokenToDecimal(event.params.tokenAmt, 18)
    ),
  };
  context.TokenPosition.set(updatedTpPF);
});

// Token TreasuryFee (domain)
Token.Token__TreasuryFee.handler(async ({ event, context }) => {
  const tokenId = event.srcAddress.toLowerCase();
  const token = await context.Token.getOrThrow(tokenId);
  const updatedTokenTF = {
    ...token,
    treasuryRevenueQuote: add(
      token.treasuryRevenueQuote,
      convertTokenToDecimal(event.params.quoteRaw, 6)
    ),
    treasuryRevenueToken: add(
      token.treasuryRevenueToken,
      convertTokenToDecimal(event.params.tokenAmt, 18)
    ),
  };
  context.Token.set(updatedTokenTF);
});

// Token ContentFee (domain)
Token.Token__ContentFee.handler(async ({ event, context }) => {
  const tokenId = event.srcAddress.toLowerCase();
  const token = await context.Token.getOrThrow(tokenId);
  const updatedTokenCF = {
    ...token,
    contentRevenueQuote: add(
      token.contentRevenueQuote,
      convertTokenToDecimal(event.params.quoteRaw, 6)
    ),
    contentRevenueToken: add(
      token.contentRevenueToken,
      convertTokenToDecimal(event.params.tokenAmt, 18)
    ),
  };
  context.Token.set(updatedTokenCF);
});

// Token Borrow (domain)
Token.Token__Borrow.handler(async ({ event, context }) => {
  const who = event.params.who.toLowerCase();
  const to = event.params.to.toLowerCase();
  const tokenId = event.srcAddress.toLowerCase();

  const userWho = (await context.User.get(who)) ?? {
    id: who,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  const updatedUserWho2 = {
    ...userWho,
    txCount: (userWho.txCount as bigint) + ONE_BI,
  };
  context.User.set(updatedUserWho2);
  const userTo = (await context.User.get(to)) ?? {
    id: to,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  context.User.set(userTo);

  const tpId = `${tokenId}-${who}`;
  const tp = await context.TokenPosition.getOrThrow(tpId);
  const updatedTp3 = {
    ...tp,
    debt: add(tp.debt, convertTokenToDecimal(event.params.quoteRaw, 18)),
  };
  context.TokenPosition.set(updatedTp3);

  const directory = await context.Directory.getOrThrow(
    CORE_ADDRESS.toLowerCase()
  );
  const updatedDirectory5 = {
    ...directory,
    txCount: (directory.txCount as bigint) + ONE_BI,
  };
  context.Directory.set(updatedDirectory5);

  const token = await context.Token.getOrThrow(tokenId);
  const updatedToken7 = {
    ...token,
    txCount: (token.txCount as bigint) + ONE_BI,
  };
  context.Token.set(updatedToken7);
});

// Token Repay (domain)
Token.Token__Repay.handler(async ({ event, context }) => {
  const who = event.params.who.toLowerCase();
  const to = event.params.to.toLowerCase();
  const tokenId = event.srcAddress.toLowerCase();

  const userWho = (await context.User.get(who)) ?? {
    id: who,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  const updatedUserWho3 = {
    ...userWho,
    txCount: (userWho.txCount as bigint) + ONE_BI,
  };
  context.User.set(updatedUserWho3);
  const userTo = (await context.User.get(to)) ?? {
    id: to,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  context.User.set(userTo);

  const tpId = `${tokenId}-${to}`;
  const tp = await context.TokenPosition.getOrThrow(tpId);
  const updatedTp4 = {
    ...tp,
    debt: sub(tp.debt, convertTokenToDecimal(event.params.quoteRaw, 18)),
  };
  context.TokenPosition.set(updatedTp4);

  const directory = await context.Directory.getOrThrow(
    CORE_ADDRESS.toLowerCase()
  );
  const updatedDirectory6 = {
    ...directory,
    txCount: (directory.txCount as bigint) + ONE_BI,
  };
  context.Directory.set(updatedDirectory6);

  const token = await context.Token.getOrThrow(tokenId);
  const updatedToken8 = {
    ...token,
    txCount: (token.txCount as bigint) + ONE_BI,
  };
  context.Token.set(updatedToken8);
});

// Content Curated (domain)
Content.Content__Curated.handler(async ({ event, context }) => {
  const who = event.params.who.toLowerCase();
  const to = event.params.to.toLowerCase();
  const contentId = event.srcAddress.toLowerCase();
  const price = convertTokenToDecimal(event.params.price, 6);

  const userWho = (await context.User.get(who)) ?? {
    id: who,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  const updatedUserWho4 = {
    ...userWho,
    txCount: (userWho.txCount as bigint) + ONE_BI,
  };
  context.User.set(updatedUserWho4);
  const userTo = (await context.User.get(to)) ?? {
    id: to,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  context.User.set(userTo);

  const directory = await context.Directory.getOrThrow(
    CORE_ADDRESS.toLowerCase()
  );
  const updatedDirectory4 = {
    ...directory,
    curateVolume: add(directory.curateVolume, price),
    txCount: (directory.txCount as bigint) + ONE_BI,
  };
  context.Directory.set(updatedDirectory4);

  const content = await context.Content.getOrThrow(contentId);
  const token = await context.Token.getOrThrow(content.token);
  const updatedToken5 = {
    ...token,
    curateVolume: add(token.curateVolume, price),
    txCount: (token.txCount as bigint) + ONE_BI,
  };
  context.Token.set(updatedToken5);

  const cpId = `${content.token}-${event.params.tokenId.toString()}`;
  const contentPosition = await context.ContentPosition.getOrThrow(cpId);
  const prevOwner = contentPosition.owner;
  const prevPrice = contentPosition.price;
  const updatedContentPosition = {
    ...contentPosition,
    owner: to,
    price,
    nextPrice: add(mul(price, "1.1"), "1"),
    curationCount: (contentPosition.curationCount as bigint) + ONE_BI,
  };
  context.ContentPosition.set(updatedContentPosition);

  const surplus = sub(updatedContentPosition.price, prevPrice);

  const creatorTpId = `${contentPosition.token}-${contentPosition.creator}`;
  const creatorTp = (await context.TokenPosition.get(creatorTpId)) ?? {
    id: creatorTpId,
    token: content.token,
    user: contentPosition.creator,
    balance: "0",
    debt: "0",
    contentCreated: ZERO_BI,
    createdCurations: ZERO_BI,
    createdValue: "0",
    contentOwned: ZERO_BI,
    contentBalance: "0",
    curationSpend: "0",
    creatorRevenueQuote: "0",
    ownerRevenueQuote: "0",
    affiliateRevenueQuote: "0",
    affiliateRevenueToken: "0",
    curatorRevenueQuote: "0",
    curatorRevenueToken: "0",
  };
  const updatedCreatorTp = {
    ...creatorTp,
    creatorRevenueQuote: add(creatorTp.creatorRevenueQuote, div(surplus, "3")),
    createdCurations: (creatorTp.createdCurations as bigint) + ONE_BI,
    createdValue: add(creatorTp.createdValue, surplus),
  };
  context.TokenPosition.set(updatedCreatorTp);

  const prevOwnerTpId = `${contentPosition.token}-${prevOwner}`;
  const prevOwnerTp = (await context.TokenPosition.get(prevOwnerTpId)) ?? {
    id: prevOwnerTpId,
    token: content.token,
    user: prevOwner,
    balance: "0",
    debt: "0",
    contentCreated: ZERO_BI,
    createdCurations: ZERO_BI,
    createdValue: "0",
    contentOwned: ZERO_BI,
    contentBalance: "0",
    curationSpend: "0",
    creatorRevenueQuote: "0",
    ownerRevenueQuote: "0",
    affiliateRevenueQuote: "0",
    affiliateRevenueToken: "0",
    curatorRevenueQuote: "0",
    curatorRevenueToken: "0",
  };
  const updatedPrevOwnerTp = {
    ...prevOwnerTp,
    ownerRevenueQuote: add(
      add(prevOwnerTp.ownerRevenueQuote, prevPrice),
      div(surplus, "3")
    ),
  };
  context.TokenPosition.set(updatedPrevOwnerTp);

  const updatedToken6 = {
    ...token,
    creatorRewardsQuote: add(token.creatorRewardsQuote, div(surplus, "3")),
    curatorRewardsQuote: add(token.curatorRewardsQuote, div(surplus, "3")),
  };
  context.Token.set(updatedToken6);

  const curateId = `${event.chainId}_${event.block.number}_${event.logIndex}`;
  context.Curate.set({
    id: curateId,
    token: content.token,
    creator: contentPosition.creator,
    prevOwner,
    user: to,
    tokenId: event.params.tokenId,
    uri: contentPosition.uri,
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp),
    price: contentPosition.price,
    surplus,
  } as any);

  const ts = event.block.timestamp;
  const dayIndex = Math.floor(ts / 86400);
  const dayStart = dayIndex * 86400;
  const dayId = `${token.id}-${dayIndex}`;
  const day = (await context.ContentDayData.get(dayId)) ?? {
    id: dayId,
    token: token.id,
    timestamp: BigInt(dayStart),
    volume: "0",
    surplus: "0",
  };
  const updatedDay2 = {
    ...day,
    volume: add(day.volume, updatedContentPosition.price),
    surplus: add(day.surplus, surplus),
  };
  context.ContentDayData.set(updatedDay2);

  const hourIndex = Math.floor(ts / 3600);
  const hourStart = hourIndex * 3600;
  const hourId = `${token.id}-${hourIndex}`;
  const hour = (await context.ContentHourData.get(hourId)) ?? {
    id: hourId,
    token: token.id,
    timestamp: BigInt(hourStart),
    volume: "0",
    surplus: "0",
  };
  const updatedHour2 = {
    ...hour,
    volume: add(hour.volume, updatedContentPosition.price),
    surplus: add(hour.surplus, surplus),
  };
  context.ContentHourData.set(updatedHour2);

  const minuteIndex = Math.floor(ts / 60);
  const minuteStart = minuteIndex * 60;
  const minuteId = `${token.id}-${minuteIndex}`;
  const minute = (await context.ContentMinuteData.get(minuteId)) ?? {
    id: minuteId,
    token: token.id,
    timestamp: BigInt(minuteStart),
    volume: "0",
    surplus: "0",
  };
  const updatedMinute2 = {
    ...minute,
    volume: add(minute.volume, updatedContentPosition.price),
    surplus: add(minute.surplus, surplus),
  };
  context.ContentMinuteData.set(updatedMinute2);
});

// Content UriSet (domain)
Content.Content__UriSet.handler(async ({ event, context }) => {
  const contentId = event.srcAddress.toLowerCase();
  const content = await context.Content.getOrThrow(contentId);
  const token = await context.Token.getOrThrow(content.token);
  const updatedToken9 = { ...token, uri: event.params.uri };
  context.Token.set(updatedToken9);
});

// Content Approved (domain)
Content.Content__Approved.handler(async ({ event, context }) => {
  const contentId = event.srcAddress.toLowerCase();
  const content = await context.Content.getOrThrow(contentId);
  const cpId = `${content.token}-${event.params.tokenId.toString()}`;
  const cp = await context.ContentPosition.getOrThrow(cpId);
  const updatedCp = { ...cp, isApproved: true };
  context.ContentPosition.set(updatedCp);
});

// Content IsModeratedSet (domain)
Content.Content__IsModeratedSet.handler(async ({ event, context }) => {
  const contentId = event.srcAddress.toLowerCase();
  const content = await context.Content.getOrThrow(contentId);
  const token = await context.Token.getOrThrow(content.token);
  const updatedToken10 = { ...token, isModerated: event.params.isModerated };
  context.Token.set(updatedToken10);
});

// Content ModeratorsSet (domain)
Content.Content__ModeratorsSet.handler(async ({ event, context }) => {
  const account = event.params.account.toLowerCase();
  const user = (await context.User.get(account)) ?? {
    id: account,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  context.User.set(user);
  const contentId = event.srcAddress.toLowerCase();
  const content = await context.Content.getOrThrow(contentId);
  const modId = `${content.token}-${account}`;
  const moderator = (await context.Moderator.get(modId)) ?? {
    id: modId,
    user: account,
    token: content.token,
    isModerator: false,
  };
  const updatedModerator = {
    ...moderator,
    isModerator: event.params.isModerator,
  };
  context.Moderator.set(updatedModerator);
});

// Content OwnershipTransferred (domain)
Content.OwnershipTransferred.handler(async ({ event, context }) => {
  const content = await context.Content.get(event.srcAddress.toLowerCase());
  if (!content) return;
  const newOwner = event.params.newOwner.toLowerCase();
  const user = (await context.User.get(newOwner)) ?? {
    id: newOwner,
    txCount: ZERO_BI,
    referrer: ADDRESS_ZERO,
  };
  context.User.set(user);
  const token = await context.Token.getOrThrow(content.token);
  const updatedToken11 = { ...token, owner: newOwner };
  context.Token.set(updatedToken11);
});

// Rewarder Withdrawn (domain)
Rewarder.Rewarder__Withdrawn.handler(async ({ event, context }) => {
  const rewarderId = event.srcAddress.toLowerCase();
  const rewarder = await context.Rewarder.getOrThrow(rewarderId);
  const token = await context.Token.getOrThrow(rewarder.token);
  const amount = convertTokenToDecimal(event.params.amount, 6);
  const updatedToken12 = {
    ...token,
    contentBalance: sub(token.contentBalance, amount),
  };
  context.Token.set(updatedToken12);

  const tpId = `${token.id}-${event.params.user.toLowerCase()}`;
  const tp = (await context.TokenPosition.get(tpId)) ?? {
    id: tpId,
    token: token.id,
    user: event.params.user.toLowerCase(),
    balance: "0",
    debt: "0",
    contentCreated: ZERO_BI,
    createdCurations: ZERO_BI,
    createdValue: "0",
    contentOwned: ZERO_BI,
    contentBalance: "0",
    curationSpend: "0",
    creatorRevenueQuote: "0",
    ownerRevenueQuote: "0",
    affiliateRevenueQuote: "0",
    affiliateRevenueToken: "0",
    curatorRevenueQuote: "0",
    curatorRevenueToken: "0",
  };
  const updatedTp5 = {
    ...tp,
    contentOwned: (tp.contentOwned as bigint) - ONE_BI,
    contentBalance: sub(tp.contentBalance, amount),
  };
  context.TokenPosition.set(updatedTp5);
});

// Rewarder RewardPaid (domain)
Rewarder.Rewarder__RewardPaid.handler(async ({ event, context }) => {
  const rewarderId = event.srcAddress.toLowerCase();
  const rewarder = await context.Rewarder.getOrThrow(rewarderId);
  const tpId = `${rewarder.token}-${event.params.user.toLowerCase()}`;
  const tp = (await context.TokenPosition.get(tpId)) ?? {
    id: tpId,
    token: rewarder.token,
    user: event.params.user.toLowerCase(),
    balance: "0",
    debt: "0",
    contentCreated: ZERO_BI,
    createdCurations: ZERO_BI,
    createdValue: "0",
    contentOwned: ZERO_BI,
    contentBalance: "0",
    curationSpend: "0",
    creatorRevenueQuote: "0",
    ownerRevenueQuote: "0",
    affiliateRevenueQuote: "0",
    affiliateRevenueToken: "0",
    curatorRevenueQuote: "0",
    curatorRevenueToken: "0",
  };
  const isUSDC =
    event.params.rewardsToken.toLowerCase() === USDC_ADDRESS.toLowerCase();
  const updatedTp6 = isUSDC
    ? {
        ...tp,
        curatorRevenueQuote: add(
          tp.curatorRevenueQuote,
          convertTokenToDecimal(event.params.reward, 6)
        ),
      }
    : {
        ...tp,
        curatorRevenueToken: add(
          tp.curatorRevenueToken,
          convertTokenToDecimal(event.params.reward, 18)
        ),
      };
  context.TokenPosition.set(updatedTp6);
});

// removed boilerplate event-centric Rewarder entity captures

// removed boilerplate event-centric Token entity captures
