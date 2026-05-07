import { createCrmContact } from "@/lib/crm/createCrmContact";

async function run() {
  const workspaceId = process.env.TEST_WORKSPACE_ID;

  if (!workspaceId) {
    throw new Error("TEST_WORKSPACE_ID missing");
  }

  const result = await createCrmContact({
    workspaceId,
    contactType: "company",
    displayName: "Test Label Company",
    legalName: "Test Label Company Pty Ltd",
    countryCode: "ZA",
    metadata: {
      source: "crm-service-test"
    }
  });

  console.log("CRM CONTACT CREATED");
  console.log(result);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
