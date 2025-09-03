import assert from "assert";
import { 
  TestHelpers,
  Content_Approval
} from "generated";
const { MockDb, Content } = TestHelpers;

describe("Content contract Approval event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Content contract Approval event
  const event = Content.Approval.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Content_Approval is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Content.Approval.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualContentApproval = mockDbUpdated.entities.Content_Approval.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedContentApproval: Content_Approval = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      approved: event.params.approved,
      tokenId: event.params.tokenId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualContentApproval, expectedContentApproval, "Actual ContentApproval should be the same as the expectedContentApproval");
  });
});
