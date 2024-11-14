export async function onRequestPost({ params, env }) {
  const { policyId } = params;
  // Replace with your Cloudflare account details

  const accountId = env.ACCOUNT_ID;
  const ruleId = env.RULE_ID;
  const userEmail = env.USER_EMAIL;
  const apiKey = env.API_KEY;
  const networkPolicyApi = `https://api.cloudflare.com/client/v4/accounts/${accountId}/gateway/rules/${ruleId}`;
  
  const enableAccess = "not(identity.email == \"miguel@jdores.xyz\")";
  const disableAccess = "";

  console.log(policyId);
  if (policyId == 1){
    newIdentity = enableAccess;
  }
  if (policyId == 2){
    newIdentity = disableAccess;
  }
  console.log(newIdentity);

  const policyUpdate = {
    name: "Technician access - explicit allow",
    description: "Updated by Cloudflare Pages",
    precedence: 0,
    enabled: true,
    action: "block",
    filters: ["l4"],
    traffic: "net.dst.ip == 10.132.0.2",
    identity: `${newIdentity}`,
    device_posture: "",
    version: 1,
    rule_settings: {
      block_page_enabled: false,
      block_reason: "",
      override_ips: null,
      override_host: "",
      l4override: null,
      biso_admin_controls: null,
      add_headers: null,
      ip_categories: false,
      ip_indicator_feeds: false,
      check_session: null,
      insecure_disable_dnssec_validation: false,
      notification_settings: {
        enabled: true,
        msg: "Access denied to SSH server. You need to enable the explicit allow.",
        support_url: "https://explicitallow.jdores.xyz/"
      }
    }
  }

  try {
    // Make the API request to Cloudflare Gateway
    const response = await fetch(networkPolicyApi, {
      method: 'PUT',
      headers: {
        'X-Auth-Email': userEmail,
        'X-Auth-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(policyUpdate)
    });

    const result = await response.json();

    console.log(response.status)
    if (response.ok) {
      return new Response(JSON.stringify(result), { status: 200 });
    } else {
      return new Response(JSON.stringify(result), { status: "response.status" });
    }
  } catch (error) {
    return new Response('Error updating policy', { status: 500 });
  }
}