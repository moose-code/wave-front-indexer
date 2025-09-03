/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Content,
  Content_Approval,
  Content_ApprovalForAll,
  Content_BatchMetadataUpdate,
  Content_Content__Approved,
  Content_Content__Created,
  Content_Content__Curated,
  Content_Content__IsModeratedSet,
  Content_Content__ModeratorsSet,
  Content_Content__RewardAdded,
  Content_Content__UriSet,
  Content_MetadataUpdate,
  Content_OwnershipTransferred,
  Content_Transfer,
  Core,
  Core_Core__TokenCreated,
  Rewarder,
  Rewarder_Rewarder__Deposited,
  Rewarder_Rewarder__RewardAdded,
  Rewarder_Rewarder__RewardNotified,
  Rewarder_Rewarder__RewardPaid,
  Rewarder_Rewarder__Withdrawn,
  Token,
  Token_Approval,
  Token_DelegateChanged,
  Token_DelegateVotesChanged,
  Token_EIP712DomainChanged,
  Token_Token__Borrow,
  Token_Token__Burn,
  Token_Token__BurnReserves,
  Token_Token__ContentFee,
  Token_Token__Heal,
  Token_Token__HealReserves,
  Token_Token__ProviderFee,
  Token_Token__Repay,
  Token_Token__Swap,
  Token_Token__SyncReserves,
  Token_Token__TreasuryFee,
  Token_Transfer,
} from "generated";

Content.Approval.handler(async ({ event, context }) => {
  const entity: Content_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    approved: event.params.approved,
    tokenId: event.params.tokenId,
  };

  context.Content_Approval.set(entity);
});

Content.ApprovalForAll.handler(async ({ event, context }) => {
  const entity: Content_ApprovalForAll = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    operator: event.params.operator,
    approved: event.params.approved,
  };

  context.Content_ApprovalForAll.set(entity);
});

Content.BatchMetadataUpdate.handler(async ({ event, context }) => {
  const entity: Content_BatchMetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _fromTokenId: event.params._fromTokenId,
    _toTokenId: event.params._toTokenId,
  };

  context.Content_BatchMetadataUpdate.set(entity);
});

Content.Content__Approved.handler(async ({ event, context }) => {
  const entity: Content_Content__Approved = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    moderator: event.params.moderator,
    tokenId: event.params.tokenId,
  };

  context.Content_Content__Approved.set(entity);
});

Content.Content__Created.handler(async ({ event, context }) => {
  const entity: Content_Content__Created = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    who: event.params.who,
    to: event.params.to,
    tokenId: event.params.tokenId,
    uri: event.params.uri,
  };

  context.Content_Content__Created.set(entity);
});

Content.Content__Curated.handler(async ({ event, context }) => {
  const entity: Content_Content__Curated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    who: event.params.who,
    to: event.params.to,
    tokenId: event.params.tokenId,
    price: event.params.price,
  };

  context.Content_Content__Curated.set(entity);
});

Content.Content__IsModeratedSet.handler(async ({ event, context }) => {
  const entity: Content_Content__IsModeratedSet = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    isModerated: event.params.isModerated,
  };

  context.Content_Content__IsModeratedSet.set(entity);
});

Content.Content__ModeratorsSet.handler(async ({ event, context }) => {
  const entity: Content_Content__ModeratorsSet = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
    isModerator: event.params.isModerator,
  };

  context.Content_Content__ModeratorsSet.set(entity);
});

Content.Content__RewardAdded.handler(async ({ event, context }) => {
  const entity: Content_Content__RewardAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    rewardToken: event.params.rewardToken,
  };

  context.Content_Content__RewardAdded.set(entity);
});

Content.Content__UriSet.handler(async ({ event, context }) => {
  const entity: Content_Content__UriSet = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    uri: event.params.uri,
  };

  context.Content_Content__UriSet.set(entity);
});

Content.MetadataUpdate.handler(async ({ event, context }) => {
  const entity: Content_MetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _tokenId: event.params._tokenId,
  };

  context.Content_MetadataUpdate.set(entity);
});

Content.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: Content_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.Content_OwnershipTransferred.set(entity);
});

Content.Transfer.handler(async ({ event, context }) => {
  const entity: Content_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
  };

  context.Content_Transfer.set(entity);
});

Core.Core__TokenCreated.handler(async ({ event, context }) => {
  const entity: Core_Core__TokenCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    name: event.params.name,
    symbol: event.params.symbol,
    uri: event.params.uri,
    index: event.params.index,
    token: event.params.token,
    content: event.params.content,
    rewarder: event.params.rewarder,
    owner: event.params.owner,
    isModerated: event.params.isModerated,
  };

  context.Core_Core__TokenCreated.set(entity);
});

Rewarder.Rewarder__Deposited.handler(async ({ event, context }) => {
  const entity: Rewarder_Rewarder__Deposited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    amount: event.params.amount,
  };

  context.Rewarder_Rewarder__Deposited.set(entity);
});

Rewarder.Rewarder__RewardAdded.handler(async ({ event, context }) => {
  const entity: Rewarder_Rewarder__RewardAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    rewardToken: event.params.rewardToken,
  };

  context.Rewarder_Rewarder__RewardAdded.set(entity);
});

Rewarder.Rewarder__RewardNotified.handler(async ({ event, context }) => {
  const entity: Rewarder_Rewarder__RewardNotified = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    rewardToken: event.params.rewardToken,
    reward: event.params.reward,
  };

  context.Rewarder_Rewarder__RewardNotified.set(entity);
});

Rewarder.Rewarder__RewardPaid.handler(async ({ event, context }) => {
  const entity: Rewarder_Rewarder__RewardPaid = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    rewardsToken: event.params.rewardsToken,
    reward: event.params.reward,
  };

  context.Rewarder_Rewarder__RewardPaid.set(entity);
});

Rewarder.Rewarder__Withdrawn.handler(async ({ event, context }) => {
  const entity: Rewarder_Rewarder__Withdrawn = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    amount: event.params.amount,
  };

  context.Rewarder_Rewarder__Withdrawn.set(entity);
});

Token.Approval.handler(async ({ event, context }) => {
  const entity: Token_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    spender: event.params.spender,
    value: event.params.value,
  };

  context.Token_Approval.set(entity);
});

Token.DelegateChanged.handler(async ({ event, context }) => {
  const entity: Token_DelegateChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    delegator: event.params.delegator,
    fromDelegate: event.params.fromDelegate,
    toDelegate: event.params.toDelegate,
  };

  context.Token_DelegateChanged.set(entity);
});

Token.DelegateVotesChanged.handler(async ({ event, context }) => {
  const entity: Token_DelegateVotesChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    delegate: event.params.delegate,
    previousBalance: event.params.previousBalance,
    newBalance: event.params.newBalance,
  };

  context.Token_DelegateVotesChanged.set(entity);
});

Token.EIP712DomainChanged.handler(async ({ event, context }) => {
  const entity: Token_EIP712DomainChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  };

  context.Token_EIP712DomainChanged.set(entity);
});

Token.Token__Borrow.handler(async ({ event, context }) => {
  const entity: Token_Token__Borrow = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    who: event.params.who,
    to: event.params.to,
    quoteRaw: event.params.quoteRaw,
  };

  context.Token_Token__Borrow.set(entity);
});

Token.Token__Burn.handler(async ({ event, context }) => {
  const entity: Token_Token__Burn = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    who: event.params.who,
    tokenAmt: event.params.tokenAmt,
  };

  context.Token_Token__Burn.set(entity);
});

Token.Token__BurnReserves.handler(async ({ event, context }) => {
  const entity: Token_Token__BurnReserves = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenAmt: event.params.tokenAmt,
    reserveBurn: event.params.reserveBurn,
  };

  context.Token_Token__BurnReserves.set(entity);
});

Token.Token__ContentFee.handler(async ({ event, context }) => {
  const entity: Token_Token__ContentFee = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    to: event.params.to,
    quoteRaw: event.params.quoteRaw,
    tokenAmt: event.params.tokenAmt,
  };

  context.Token_Token__ContentFee.set(entity);
});

Token.Token__Heal.handler(async ({ event, context }) => {
  const entity: Token_Token__Heal = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    who: event.params.who,
    quoteRaw: event.params.quoteRaw,
  };

  context.Token_Token__Heal.set(entity);
});

Token.Token__HealReserves.handler(async ({ event, context }) => {
  const entity: Token_Token__HealReserves = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    quoteWad: event.params.quoteWad,
    virtAddWad: event.params.virtAddWad,
  };

  context.Token_Token__HealReserves.set(entity);
});

Token.Token__ProviderFee.handler(async ({ event, context }) => {
  const entity: Token_Token__ProviderFee = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    to: event.params.to,
    quoteRaw: event.params.quoteRaw,
    tokenAmt: event.params.tokenAmt,
  };

  context.Token_Token__ProviderFee.set(entity);
});

Token.Token__Repay.handler(async ({ event, context }) => {
  const entity: Token_Token__Repay = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    who: event.params.who,
    to: event.params.to,
    quoteRaw: event.params.quoteRaw,
  };

  context.Token_Token__Repay.set(entity);
});

Token.Token__Swap.handler(async ({ event, context }) => {
  const entity: Token_Token__Swap = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    quoteInRaw: event.params.quoteInRaw,
    tokenIn: event.params.tokenIn,
    quoteOutRaw: event.params.quoteOutRaw,
    tokenOut: event.params.tokenOut,
    to: event.params.to,
  };

  context.Token_Token__Swap.set(entity);
});

Token.Token__SyncReserves.handler(async ({ event, context }) => {
  const entity: Token_Token__SyncReserves = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    reserveRealQuoteWad: event.params.reserveRealQuoteWad,
    reserveVirtQuoteWad: event.params.reserveVirtQuoteWad,
    reserveTokenAmt: event.params.reserveTokenAmt,
  };

  context.Token_Token__SyncReserves.set(entity);
});

Token.Token__TreasuryFee.handler(async ({ event, context }) => {
  const entity: Token_Token__TreasuryFee = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    to: event.params.to,
    quoteRaw: event.params.quoteRaw,
    tokenAmt: event.params.tokenAmt,
  };

  context.Token_Token__TreasuryFee.set(entity);
});

Token.Transfer.handler(async ({ event, context }) => {
  const entity: Token_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
  };

  context.Token_Transfer.set(entity);
});
